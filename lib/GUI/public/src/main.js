


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
                //success: showRecords
                statusCode: {
                    400: function() {
                      alert( "Log file not found!" );
                    },
                    200: function() {
                      alert( "Log been deleted! Please refresh." );
                    }
                }
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
        },
        IDshowConvert() {
            ;
        }
    },
    template: `
        <ol id="record_table">
            <li v-for="record in recordTable">
                <recordsInOneFile :record="record"/>
            </li>
        </ol>
        <button type="button" class="btn btn-primary" style="margin:6px" @click="refresh">Refresh</button>
        <button type="button" class="btn btn-danger" style="margin:6px" @click="DeleteAll">Delete All</button>
        <button type="button" class="btn .btn-info" style="margin:6px" @click="IDshowConvert">Only Show Mutations With ID</button>`
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
        <div @click="showDetail">Record start time: {{ new Date(record.time).toLocaleString() }}</div>
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
                        <mutationRecord :mu_record="mutation" :benchmarkTime="cmd_record.time"/>
                    </li>
                </ol>
       `
})

app.component('mutationRecord', {
    props: {
        mu_record: Object,
        benchmarkTime: Number
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
    computed: {
        mu_description: function() {
            if (this.mu_record.type == 'childList') {
                if (this.mu_record.addedNodes.length > 0)
                    return this.mu_record.addedNodes.length.toString() + ' child nodes have been added.';
                else
                    return this.mu_record.removedNodes.length.toString() + ' child nodes have been removed.';
            }
            else if (this.mu_record.type == 'attributes')
                return '\'' + this.mu_record.attributeName + '\' attribute was modified.'
            else if (this.mu_record.type == 'characterData')
                return 'Character data was modified.';
            else
                return 'Unrecognized mutation type.'
        },
        relative_time: function() {
            return this.mu_record.timestamp - this.benchmarkTime;
        }
    },
    template: `
        <div @click="showDetail">{{mu_description}} RT: {{relative_time}}</div>
        <div v-show="isShow">{{mu_record}}</div>
       `
})

app.mount('#app')