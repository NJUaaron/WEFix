'use strict';

const Pack = require('../package');
const Fixer = require('../lib/fixer');
const Version = Pack.version;

const Argv = process.argv;
const params = Argv.slice(2);



const log = function(...args) {
    console.log(...args);
    process.stdin.pause();
};

async function ftfixer() {
    if (!params[0] || /^(-h|--help)$/.test(params[0]))
        return help();

    if (/^(-v|--version)$/.test(params[0]))
        return log('v' + Version);
    
    if (/(.js)$/.test(params[0]))
        return Fixer.fix(params[0]);
    
    return log('Command not found.')
}

function help() {
    const bin = require('../help');
    const usage = 'Usage: ftfixer [options]';
    
    console.log(usage);
    console.log('Options:');
    
    for (const name of Object.keys(bin)) {
        console.log('  %s %s', name, bin[name]);
    }
}

ftfixer();