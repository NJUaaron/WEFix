const fs = require('fs');
const { MUTATIONS_LOG_PATH, OBSERVER_FILE_PATH, DEFAULT_WAIT_TIME } = require('./lib/global')

var FTfixer = {}


FTfixer.waitFor = async function (timeout = DEFAULT_WAIT_TIME) {
    return new Promise(r => {
        setTimeout(() => {
            r();
        }, timeout);
    });
}

FTfixer.waitUntil = async function (conFunc, timeout = DEFAULT_WAIT_TIME, interval = 10) {    // conFunc: condition function(async)
    var timeoutFlag = false;
    setTimeout(() => timeoutFlag = true, timeout);

    while (!timeoutFlag) {
        var res = await conFunc();
        if (res) {
            return true;
        }
        else {
            await this.waitFor(interval);
        }
    }
    return false;
}

FTfixer.parseCookie = function (cookies) {
    var mutations = []; //mutation array

    for (let i in cookies) {
        // Replace %22 and %2C
        //cookieStr = cookies[i].value.split("%22").join("\"").split("%2C").join(",");
        if (cookies[i].name.slice(0, 5) != 'ftFix')
            continue;

        let cookieStr = cookies[i].value
        try{
            let mlist = JSON.parse(cookieStr);
            //console.log(cookies[i]);
            let timestamp = parseInt(cookies[i].name.slice(5)); //remove flag
            for (let j in mlist) {
                let mutation = mlist[j];
                mutation.timestamp = timestamp;
                mutations.push(mutation);
            }
        }
        catch (err) {
            console.error('Failed to parse: ' + cookieStr);
        }
    }
    return mutations;

}

FTfixer.before_cmd = async function (driver) {
    var snippet = '';
    try {
        snippet = fs.readFileSync(OBSERVER_FILE_PATH, 'utf8');
    }
    catch (err) {
        console.error('Unable to open mutationObserver file at: ' + snippet_path);
        return;
    }
    await driver.executeScript(snippet);
    await driver.manage().deleteAllCookies();
}

FTfixer.before_cmd_cy = async function (cy) {
    cy.readFile(OBSERVER_FILE_PATH).then((code) => {
        cy.window().then((win) => {
            win.eval(code);
        });
    });
    cy.clearCookies();
}

FTfixer.after_cmd = async function (driver, filename, start_line, start_col, sentence) {
    await FTfixer.waitFor(DEFAULT_WAIT_TIME);
    var cookies = await driver.manage().getCookies();
    var timestamp = Date.now() - DEFAULT_WAIT_TIME; //miliseconds
    var mutations = FTfixer.parseCookie(cookies);
    
    var record = {
        "time": timestamp,
        "filename": filename,
        "start_line": start_line,
        "start_col": start_col,
        "sentence": sentence,
        "mutations": mutations
    };
    // Append to log file
    fs.appendFile(MUTATIONS_LOG_PATH, JSON.stringify(record) + '\r\n', function(err){
        if(err)
            console.error('save to log file fails.');
    })
}

FTfixer.after_cmd_cy = async function (cy, filename, start_line, start_col, sentence) {
    cy.wait(DEFAULT_WAIT_TIME);
    cy.getCookies().then((cookies) => {
        var mutations = FTfixer.parseCookie(cookies);
        var timestamp = Date.now() - DEFAULT_WAIT_TIME;     
        var record = {
            "time": timestamp,
            "filename": filename,
            "start_line": start_line,
            "start_col": start_col,
            "sentence": sentence,
            "mutations": mutations
        };
        // Append to log file
        cy.readFile(MUTATIONS_LOG_PATH).then((str) => {
            cy.writeFile(MUTATIONS_LOG_PATH, str + JSON.stringify(record) + '\r\n')
        })
        
        cy.log(record)
    })
}



module.exports = FTfixer;