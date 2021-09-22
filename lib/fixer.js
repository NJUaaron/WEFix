const fs = require('fs');
const {parse} = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
//import { parse } from '@babel/parser';
//import traverse from '@babel/traverse';
// import generate from '@babel/generator';

var Fixer = {}

Fixer.fix = function(file) {
    console.log('Start auto fixing.');
    var f;
    try {
        f = fs.readFileSync(file, 'utf8');
        console.log(f);
    }
    catch(err){
        console.error('Unable to find ' + file);
    }
    var ast = parse(f);
    //console.log(ast);
    
    traverse(ast, {
        enter(path) {
            // in this example change all the variable `n` to `x`
            if (path.isIdentifier({ name: 'a' })) {
                path.node.name = 'n';
            }
        },
    });
    console.log(generate);
    // generate code <- ast
    const output = generate(ast, f);
    console.log(output.code);
}

module.exports = Fixer;