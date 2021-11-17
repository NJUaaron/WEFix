
// Execute when document is ready
$(() => {
    GetRecords();
});

function showRecords(records){
    console.log(records);
    // $("ol#mList").empty();
    // for (i in members){
    //     var m_name = "<li><ul class='mInfo'><li>name: "+members[i].name+"</li>";
    //     var m_email = "<li>email: "+members[i].email+"</li></ul></li>";
    //     $("ol#mList").append(m_name+m_email);
    // }
}

function GetRecords() {
    $.ajax({
        type: "GET",
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
