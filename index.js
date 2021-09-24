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

// start mutation observer code snippet
// Minified mutationObserver.js
FTTest.START_MO_SNIPPET = `function cookieSet(e){if("undefined"==typeof document)return;var t=(new Date).getTime(),o=JSON.stringify(e),r=new Date(Date.now()+8e3).toUTCString();cookieStr="ftFix"+t+"="+o+"; expires="+r,document.cookie=cookieStr}function StartObserver(){console.log("Start mutaion oberver");new MutationObserver((function(e,t){var o=[];for(let t in e){const r=e[t];let d=convertRecord(r);o.push(d),"childList"===r.type?console.log("A child node has been added or removed."):"attributes"===r.type?console.log("The "+r.attributeName+" attribute was modified."):"characterData"===r.type&&console.log("Character data was modified.")}cookieSet(o)})).observe(document,{attributes:!0,childList:!0,subtree:!0}),console.log("Mutation observer started")}function convertRecord(e){var t={};t.target=convertNode(e.target),t.addedNodes=[];var o=e.addedNodes;for(let e=0;e<o.length;e++)t.addedNodes.push(convertNode(o[e]));t.removedNodes=[];var r=e.removedNodes;for(let e=0;e<r.length;e++)t.removedNodes.push(convertNode(r[e]));return t.type=e.type,t.attributeName=e.attributeName,t.oldValue=e.oldValue,t}function convertNode(e){var t={};return t.nodeName=e.nodeName,t.className=e.className,t.id=e.id,t.childElementCount=e.childElementCount,t}StartObserver();`

module.exports = FTTest;