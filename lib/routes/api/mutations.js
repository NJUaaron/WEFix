const express = require('express');
const router = express.Router();
const fs = require('fs');

var record_list = [];
const logfile_path = __dirname + '/../../../.mutationslog';

router.get('/', (req, res) => {
    if (record_list.length == 0) {
        var content = '';
        try {
            content = fs.readFileSync(__dirname + '/../../../.mutationslog', 'utf8');
        }
        catch (err) {
            console.error('Unable to open mutation log file');
            res.json(record_list);
            return;
        }
        console.log('read mutation log from file');
        var records = content.split('\r\n');
        for (let record of records) {
            if (record) {
                record_list.push(JSON.parse(record));
            }
        }
    }
    // Sort based on timestamp
    record_list.sort((a, b) => a.time > b.time );
    res.json(record_list);
});

router.get('/refresh', (req, res) => {
    // Read from file again
    record_list = [];

    var content = '';
    try {
        content = fs.readFileSync(logfile_path, 'utf8');
    }
    catch (err) {
        console.error('Unable to open mutation log file');
        res.json(record_list);
        return;
    }
    console.log('read mutation log from file');
    var records = content.split('\r\n');
    for (let record of records) {
        if (record) {
            record_list.push(JSON.parse(record));
        }
    }
    // Sort based on timestamp
    record_list.sort((a, b) => a.time > b.time );
    res.json(record_list);
});
// router.post('/', (req, res) => {
//     const newMember = {
//         //id: uuid.v4(),
//         name: req.body.name,
//         email: req.body.email,
//         //status: 'active'
//     }

//     if(!newMember.name || !newMember.email){
//         return res.status(400).json({ msg: 'Please include a name and email'});
//     }

//     members.push(newMember);
//     res.json(members);
// });

router.delete('/', (req, res) => {
    try {
        // remove log file
        fs.unlinkSync(logfile_path);
    }
    catch (err) {
        ;
    }
    res.json([]);
});

module.exports = router;