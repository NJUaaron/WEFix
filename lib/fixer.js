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

Fixer.fix = function(file_path) {
    console.log('Start auto fixing.');
    var raw_code;
    try {
        raw_code = fs.readFileSync(file_path, 'utf8');
    }
    catch(err){
        console.error('Unable to find ' + file_path);
    }
    
    //console.log(ast);

    var tc = preTransform(raw_code);
    const f_anal_path = file_path.slice(0, -2) + 'anal.js';
    fs.writeFileSync(f_anal_path, tc);


    // // Insert Analyzing Code    
    // f_anal = InsertAnalCode(f);
    // const f_anal_path = file_path.slice(0, -2) + 'anal.js';
    // fs.writeFileSync(f_anal_path, f_anal);
    // var stdout = execSync('node' + f_anal_path).toString();

    
    
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

function InsertAnalCode() {


    return `hi code`;
}



function preTransform(code){
    var first_test_loc = code.match(/test\(/).index;

    var before_test_codes = code.slice(0, first_test_loc);
    var after_test_codes = code.slice(first_test_loc);
    let matchList = [...before_test_codes.matchAll(';')];
    var require_codes_end_loc = matchList[matchList.length-1].index;


    var require_codes = code.slice(0, require_codes_end_loc+1);

    var block_codes = extractBlock(after_test_codes);
    return require_codes
        + '\nasync function main(){'
        + block_codes
        + '}\nmain();';
}

function extractBlock(code){
    // Find first left large parenthesis (LLP)
    var first_LLP_loc = code.match(/\{/).index;
    var block_count = 0
    for (let i = first_LLP_loc; i < code.length; i++) {
        if (code[i] === '}'){
            block_count = block_count - 1;
            if (block_count == 0){
                // Return the block end location
                return code.slice(first_LLP_loc+1, i);
            }
        }
        if (code[i] === '{'){
            block_count = block_count + 1;
        }
    }
    // Failed to find a block
    return null;
}

module.exports = Fixer;