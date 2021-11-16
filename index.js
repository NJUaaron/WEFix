const fs = require('fs');

var FTTest = {}


FTTest.waitFor = async function (timeout = 2000) {
    return new Promise(r => {
        setTimeout(() => {
            r();
        }, timeout);
    });
}

FTTest.waitUntil = async function (conFunc, timeout = 2000, interval = 10) {    // conFunc: condition function(async)
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

FTTest.parseCookie = function (cookies) {
    var mutations = []; //mutation array

    for (let i in cookies) {
        // Replace %22 and %2C
        //cookieStr = cookies[i].value.split("%22").join("\"").split("%2C").join(",");
        let cookieStr = cookies[i].value

        let mlist = JSON.parse(cookieStr);
        //console.log(cookies[i]);
        let timestamp = parseInt(cookies[i].name.slice(5)); //remove flag
        for (let j in mlist) {
            let mutation = mlist[j];
            mutation.timestamp = timestamp;
            mutations.push(mutation);
        }
    }
    return mutations;

}

FTTest.before_cmd = async function (driver) {
    var snippet_path = __dirname + '/lib/mutationObserver.min.js'
    var snippet = '';
    try {
        snippet = fs.readFileSync(snippet_path, 'utf8');
    }
    catch (err) {
        console.error('Unable to open mutationObserver file at: ' + snippet_path);
        return;
    }
    await driver.executeScript(snippet);
    await driver.manage().deleteAllCookies();
}

FTTest.after_cmd = async function (driver, filename, start_line, start_col) {
    await FTTest.waitFor(2000);
    var cookies = await driver.manage().getCookies();
    var mutations = FTFixer.parseCookie(cookies);
    var timestamp = Date.now();
    var record = {
        "time": timestamp,
        "filename": filename,
        "start_line": start_line,
        "start_col": start_col,
        "mutations": mutations
    };
    // Append to log file
    fs.appendFile(__dirname + '/.mutationslog', JSON.stringify(record) + '\r\n', function(err){
        if(err)
            console.error('save to log file fails.');
    })
}



module.exports = FTTest;