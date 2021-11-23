


const app = Vue.createApp({
    template: `
            <recordTablePanel></recordTablePanel>`
})

app.component('recordTablePanel', {
    data() {
        return {
            recordTable: []
        }
    },
    created() {
        Vue.onMounted(() => {
            $.ajax({
                type: "GET",
                url: "/api/mutations",
                success: this.UpdateRecordTable
            })
        })
    },
    methods: {
        refresh() {
            $.ajax({
                type: "GET",
                url: "/api/mutations/refresh",
                success: this.UpdateRecordTable
            });
        },
        DeleteAll() {
            $.ajax({
                type: "DELETE",
                url: "/api/mutations",
                success: showRecords
            });
        },
        UpdateRecordTable(records) {
            if (!records || records.length == 0)
                return;

            // First, categorize based on filename
            this.recordTable = [];
            this.recordTable.push({
                filename: records[0].filename,
                time: records[0].time,
                cmd_list: [records[0]]
            });
            for (let i = 1; i < records.length; i++) {
                let record = records[i];
                if (record.filename != this.recordTable[this.recordTable.length - 1].filename) {
                    // create a new file entry in file_list
                    this.recordTable.push({
                        filename: record.filename,
                        time: record.time,
                        cmd_list: [record]
                    });
                }
                else {
                    this.recordTable[this.recordTable.length - 1].cmd_list.push(record);
                }
            }
        }
    },
    template: `
        <ol id="record_table">
            <li v-for="record in recordTable">
                <recordsInOneFile :record="record"/>
            </li>
        </ol>
        <button @click="refresh">Refresh</button>
        <button @click="DeleteAll">Delete all</button>`
})

app.component('recordsInOneFile', {
    props: {
        record: Object
        
    },
    data() {
        return {
            isShow: false
        }
    },
    methods: {
        showDetail() {
            this.isShow = !this.isShow
        }
    },
    template: `
        <div @click="showDetail">File name: {{record.filename}}</div>
        <div @click="showDetail">Record start time: {{ new Date().toUTCString(record.time) }}</div>
        <ol class="cmd_list">
            <li v-show="isShow" v-for="cmd in record.cmd_list">
                <commandRecord :cmd_record="cmd"/>
            </li>
        </ol>
       `
})

app.component('commandRecord', {
    props: {
        cmd_record: Object
    },
    data() {
        return {
            isShow: false
        }
    },
    methods: {
        showDetail() {
            this.isShow = !this.isShow
        }
    },
    template: `
                <div>time: {{cmd_record.time}}</div>
                <div>start line: {{cmd_record.start_line}}</div>
                <div>start col: {{cmd_record.start_col}}</div>
                <div>sentence: {{cmd_record.sentence}}</div>
                <div @click="showDetail">mutation number : {{cmd_record.mutations.length}}</div>
                <ol class="mutation_list">
                    <li v-show="isShow" v-for="mutation in cmd_record.mutations">
                        <mutationRecord :mutatioon_record="mutation"/>
                    </li>
                </ol>
       `
})

app.component('mutationRecord', {
    props: {
        mutatioon_record: Object
    },
    template: `
                <div>{{mutatioon_record}}</div>
       `
})

app.mount('#app')




// function GetRecords() {
//     $.ajax({
//         type: "GET",
//         url: "/api/mutations",
//         success: UpdateRecordTable
//     });
// }