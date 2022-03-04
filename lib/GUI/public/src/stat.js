app.component('statistics', {
    props: {
        recordTable: Object
        
    },
    computed: {
        file_num: function() {
            return this.recordTable.length
        },
        cmd_num: function() {
            cmd_n = 0
            for (i in this.recordTable) {
                cmd_n += this.recordTable[i].cmd_list.length
            }
            return cmd_n
        },
        mut_num: function() {
            mut_n = 0
            for (i in this.recordTable) {
                for (j in this.recordTable[i].cmd_list) {
                    cmd = this.recordTable[i].cmd_list[j]
                    mut_n += cmd.mutations.length
                }
            }
            return mut_n
        },
        mut_per_cmd: function() {
            return (this.mut_num / this.cmd_num).toFixed(1)
        },
        att_num: function() {
            att_n = 0
            for (i in this.recordTable) {
                for (j in this.recordTable[i].cmd_list) {
                    mutations = this.recordTable[i].cmd_list[j].mutations
                    for (m in mutations) {
                        type = mutations[m].type
                        if (type == "attributes")
                            att_n += 1
                    }
                }
            }
            return att_n
        },
        att_prop: function() {
            return (this.att_num / this.mut_num * 100).toFixed(1)
        },
        a: function() {
            return this.recordTable
        },
        // a: function() {
        // },
        // a: function() {
        // },
        // a: function() {
        // },
        // a: function() {
        // },
        // a: function() {
        // },
    },
    template: `<div id="statistics">
        <h1 >STATISTICS</h1>
        <div>file number: {{file_num}}</div>
        <div>command number: {{cmd_num}}</div>
        <div>mutation number: {{mut_num}}</div>
        <div>mutation per command: {{mut_per_cmd}} </div>
        <div>attribute mutations: {{att_num}} ({{att_prop}}%)</div>
        <div>childList mutations: 1 (10%)</div>
        <div>characterData mutations: 1 (70%)</div>
        <div>average RT: 1 (ms)</div>
        <div>{{a}}</div>

    </div>`
})