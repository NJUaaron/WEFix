const {execSync} = require("child_process");

var stdout = execSync("node test/hello.js");

console.log(stdout.toString());