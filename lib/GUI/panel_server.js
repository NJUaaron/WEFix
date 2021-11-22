const express = require("express");
const path = require("path");

function start_panel_server() {
    const app = express();

    // Body Parser Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/mutations', require('./routes/api/mutations'))

    // Set static folder
    app.use(express.static(path.join(__dirname, 'public')));

    const PORT = process.env.FTFIXER_PORT || 2077;

    app.listen(PORT, () => {console.log('🚀 Starting GUI ...\nReady on: localhost:' + PORT)});
}

module.exports = {start_panel_server};
