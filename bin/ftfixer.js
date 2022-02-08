#!/usr/bin/env node
'use strict';

const fs = require('fs');
const Pack = require('../package');
const Fixer = require('../lib/fixer');
const {Instrument_single_file, Instrument_folder} = require('../lib/instrumenter');
const {Recover_folder, Recover_single_file} = require('../lib/recover');
const {start_panel_server} = require('../lib/GUI/panel_server');
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
    
    if (/^(-p|--panel|ui)$/.test(params[0])) {
        CleanMutationData();
        return start_panel_server();
    }
    
    // code instrument for file or folder
    if (/^(-i|--instrument)$/.test(params[0]))
        return instrument(params[1]);

    if (/^(-r|--recover)$/.test(params[0]))
        return recover(params[1]);

    // auto fix based on log data
    if (/^(-f|--fix)$/.test(params[0]))
        return log('v' + Version);

    if (/(.js)$/.test(params[0]))
        return Fixer.fix(params[0]);
    
    return log('Command not found.')
}

function instrument(filepath) {
    if (!filepath)
        filepath = '.';      // default as root directory
    if (/(.js)$/.test(filepath)) {
        // single file
        if (fs.existsSync(filepath + '.ftbackup')) {
            //file exists
            console.log(filepath + 'was already instrumented. Skip.')
        }
        else
            Instrument_single_file(filepath);
    }
    else {
        // handle all js files in the the folder
        Instrument_folder(filepath);
    }
}

function recover(filepath) {
    if (!filepath)
        filepath = '.';      // default as root directory
    if (/(.ftbackup)$/.test(filepath)) {
        // single file
        Recover_single_file(filepath);
    }
    else if (/(.js)$/.test(filepath)) {
        // single file
        Recover_single_file(filepath + '.ftbackup');
    }
    else {
        // handle all js files in the the folder
        Recover_folder(filepath);
    }
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

function CleanMutationData() {
    // Read mutations from local log file
    const logfile_path = __dirname + '/../.mutationslog';
    var content = '';
    try {
        content = fs.readFileSync(logfile_path, 'utf8');
    }
    catch (err) {
        console.error('Unable to open mutation log file to read during clean process');
        return;
    }
    var records = content.split('\r\n');
    var newContent = '';

    for (let record_s of records) {
        if (record_s) {
            let record = JSON.parse(record_s)
            let mutations = record.mutations;
            var lastMutation_s = ''
            let i = mutations.length;
            while (i > 0) {
                i --;
                let mutation = mutations[i];
                let target = mutation.target;
                let Mutation_s = JSON.stringify(mutation);

                if (target && (target.nodeName == 'HEAD' || target.nodeName == 'BODY')) {
                    mutations.splice(i, 1); //remove this element
                }
                else if (Mutation_s == lastMutation_s) {
                    mutations.splice(i, 1); //remove this repeat element
                }
                else {
                    lastMutation_s = Mutation_s;
                }
                
            }
            newContent += JSON.stringify(record) + '\r\n';
        }
    }

    try {
        fs.writeFileSync(logfile_path, newContent);
    }
    catch (err) {
        console.error('Unable to open mutation log file to write during clean process');
        return;
    } 
}

ftfixer();