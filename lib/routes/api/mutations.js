const express = require('express');
const router = express.Router();
const fs = require('fs');

const record_list = []

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

// router.delete('/:id', (req, res) => {
//     var index = req.params.id;
//     var m_number= Object.keys(members).length;
//     if (index < m_number){
//         members.splice(index, 1);   // Remove the element at index
//         res.json(members);
//     }
//     else{
//         res.status(400).json({ msg: 'Delete out of range'});
//     }
        
    
    
// });

module.exports = router;