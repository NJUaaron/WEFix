
// Execute when document is ready
$(() => {
    GetRecords();
});

var file_list = [];

function showRecords(records){
    //console.log(records);
    if (!records || records.length == 0)
        return;

    // First, categorize based on filename
    file_list = [];
    file_list.push({
        filename: records[0].filename,
        time: records[0].time,
        cmd_list: [records[0]]
    });
    for (let i = 1; i < records.length; i++) {
        let record = records[i];
        if (record.filename != file_list[file_list.length - 1].filename) {
            // create a new file entry in file_list
            file_list.push({
                filename: record.filename,
                time: record.time,
                cmd_list: [record]
            });
        }
        else {
            file_list[file_list.length - 1].cmd_list.push(record);
        }
    }

    $("ol#mList").empty();
    for (file of file_list) {
        let file_li = $("<li></li>");
        let file_ul = $("<ul></ul>");
        let filename_li = $("<li></li>").text("file name: " + file.filename);
        let utc_time_li = $("<li></li>").text("record start time: " + new Date().toUTCString(file.time));
        let record_li = $("<li></li>");
        
        // let li_e = `<li id="abc" onclick="expandFileRecords('` + file.filename 
        //     + `', ` + file.time + `);"><ul><li>file name: ` + file.filename 
        //     + " </li><li>record start time: " + new Date().toUTCString(file.time) + "</li></ul></li>";
        
        
        
        
        for (let record of file.cmd_list) {
            let ul = $("<ul></ul>");
            let sl_li = $("<li></li>").text("start line: " + record.start_line);
            let sc_li = $("<li></li>").text("start column: " + record.start_col);
            let time_li = $("<li></li>").text("time stamp: " + record.time);
            let mu = $("<li></li>");
            let mu_ol = $("<ol></ol>");
            for (let mutation of record.mutations) {
                let mu_li = $("<li></li>").text("mutation record: " + JSON.stringify(mutation));
                mu_ol.append(mu_li);
            }
            mu.append(mu_ol);
            ul.append(sl_li, sc_li, time_li, mu);
            record_li.append(ul);
        }

        file_ul.append(filename_li, utc_time_li, record_li);
        file_li.append(file_ul);
        $("ol#mList").append(file_li);
    }

    // 
    // for (i in members){
    //     var m_name = "<li><ul class='mInfo'><li>name: "+members[i].name+"</li>";
    //     var m_email = "<li>email: "+members[i].email+"</li></ul></li>";
    //     $("ol#mList").append(m_name+m_email);
    // }
}

function expandFileRecords(filename, timestamp) {
    for (let file of file_list) {
        if (file.filename == filename && file.time == timestamp) {
            console.log('hi');
            for (let record of file.cmd_list) {
                let li_e = "<li><ul><li>file name: " + record.filename + " </li><li>record start time: " + record.time + "</li></ul></li>";
                $("li#abc").append(li_e);
            }
            break;
        }  
    }
}

function GetRecords() {
    $.ajax({
        type: "GET",
        url: "/api/mutations",
        success: showRecords
    });
}

function Refresh() {
    $.ajax({
        type: "GET",
        url: "/api/mutations/refresh",
        success: showRecords
    });
}

function DeleteAll() {
    $.ajax({
        type: "DELETE",
        url: "/api/mutations",
        success: showRecords
    });
}

// function PostData() {
//     $.ajax({
//         type: "POST",
//         url: "/api/members",
//         dataType: "json",
//         data : $('form#myForm').serialize(),
//         success: printMembers
//     });
//     return false;
// }

// function DeleteData(index){
//     $.ajax({
//         type: "DELETE",
//         url: "/api/members/" + index,
//         success: printMembers
//     });
//     return false;
// }
