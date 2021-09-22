const fs = require('fs');

var Fixer = {}

Fixer.fix = function(file) {
    console.log('Start auto fixing.');
    try {
        const f = fs.readFileSync(file, 'utf8');
        console.log(f);
    }
    catch(err){
        console.error('Unable to find ' + file);
    }

}

module.exports = Fixer;