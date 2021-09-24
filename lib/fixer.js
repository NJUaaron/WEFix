'use strict'

const fs = require('fs');
const { execSync } = require("child_process");
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const { bigIntLiteral } = require('@babel/types');
//import { parse } from '@babel/parser';
//import traverse from '@babel/traverse';
// import generate from '@babel/generator';

var Fixer = {}

Fixer.fix = function (file_path) {
    console.log('Start auto fixing.');
    var raw_code;
    try {
        raw_code = fs.readFileSync(file_path, 'utf8');
    }
    catch (err) {
        console.error('Unable to find ' + file_path);
    }

    //console.log(ast);

    var tc = preTransform(raw_code);
    const f_anal_path = file_path.slice(0, -2) + 'anal.js';
    fs.writeFileSync(f_anal_path, tc);

    var stdout = execSync('node ' + f_anal_path).toString();

    var mutationsList = JSON.parse(stdout);
    console.log(mutationsList);



    // var ast = parse(f);
    // traverse(ast, {
    //     enter(path) {
    //         // in this example change all the variable `n` to `x`
    //         if (path.isIdentifier({ name: 'a' })) {
    //             path.node.name = 'n';
    //         }
    //     },
    // });
    // // generate code <- ast
    // const output = generate(ast, f);
    // console.log(output.code);
}



function preTransform(code) {
    var first_test_loc = code.match(/test\(/).index;

    var before_test_codes = code.slice(0, first_test_loc);
    var after_test_codes = code.slice(first_test_loc);
    let matchList = [...before_test_codes.matchAll(';')];
    var require_codes_end_loc = matchList[matchList.length - 1].index;


    var require_codes = code.slice(0, require_codes_end_loc + 1);

    var block_codes = extractBlock(after_test_codes);

    var instr_block_codes = instrument(block_codes);
    
    return require_codes
        + '\nconst FTFixer = require(\'@aaronxyliu/ftfixer\');'
        //+ '\nconst FTFixer = require(\'../index\');'
        + '\nasync function main(){'
        + instr_block_codes
        + '}\nmain();';
}

function extractBlock(code) {
    // Find first left large parenthesis (LLP)
    var first_LLP_loc = code.match(/\{/).index;
    var block_count = 0
    for (let i = first_LLP_loc; i < code.length; i++) {
        if (code[i] === '}') {
            block_count = block_count - 1;
            if (block_count == 0) {
                // Return the block end location
                return code.slice(first_LLP_loc + 1, i);
            }
        }
        if (code[i] === '{') {
            block_count = block_count + 1;
        }
    }
    // Failed to find a block
    return null;
}

function instrument(code) {
    // Assume every statement ends in semicolon
    var statements = code.replace('\n','').split(';');
    var new_code_list = [];
    for (let i = 0; i < statements.length; i++) {
        let statement = statements[i];
        if (statement.match(/Builder\(/)){
            new_code_list.push(statement);
            new_code_list.push(`    await driver.executeScript(FTFixer.START_MO_SNIPPET);`);
            new_code_list.push(`    var mutationsList = [];`);
        }
        else if (statement.match(/Key\./)){
            new_code_list.push(`    await driver.manage().deleteAllCookies();`);
            new_code_list.push(statement);
            new_code_list.push(`    await FTFixer.waitFor(2000);`);
            new_code_list.push(`    var cookies = await driver.manage().getCookies();`);
            new_code_list.push(`    var mutations = FTFixer.parseCookie(cookies);`);
            new_code_list.push(`    mutationsList.push(mutations);`);
        }
        else if (statement.match(/(return)|(expect)/)){
            continue;
        }
        else{
            new_code_list.push(statement);
        }
    }
    new_code_list.push(`    console.log(JSON.stringify(mutationsList));`);
    new_code_list.push(`    return;`);
    return combineStatement(new_code_list);
}

function combineStatement(list) {
    var code = ''
    for (let i = 0; i < list.length; i++) {
        code = code + list[i] + '\n';
    }
    return code;
}

module.exports = Fixer;