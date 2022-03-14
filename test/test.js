const fs = require('fs');

MUTATIONS_LOG_PATH = 'jello'
var log_path = process.env.FT_LOG_PATH || MUTATIONS_LOG_PATH
console.log(log_path)