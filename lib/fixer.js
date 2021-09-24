'use strict'

const fs = require('fs');
const { execSync } = require("child_process");
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
//import { parse } from '@babel/parser';
//import traverse from '@babel/traverse';
// import generate from '@babel/generator';

var Fixer = {}

Fixer.fix = function(file_path) {
    console.log('Start auto fixing.');
    var f;
    try {
        f = fs.readFileSync(file_path, 'utf8');
        console.log(f);
    }
    catch(err){
        console.error('Unable to find ' + file_path);
    }
    
    //console.log(ast);


    // Insert Analyzing Code    
    f_anal = InsertAnalCode(f);
    const f_anal_path = file_path.slice(0, -2) + 'anal.js';
    fs.writeFileSync(f_anal_path, f_anal);
    var stdout = execSync('node' + f_anal_path).toString();

    
    
    var ast = parse(f);
    traverse(ast, {
        enter(path) {
            // in this example change all the variable `n` to `x`
            if (path.isIdentifier({ name: 'a' })) {
                path.node.name = 'n';
            }
        },
    });
    // generate code <- ast
    const output = generate(ast, f);
    console.log(output.code);
}

function InsertAnalCode() {


    return `hi code`;
}

module.exports = Fixer;