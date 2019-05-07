require("dotenv").config();
require("express-async-errors");
// var fs = require('fs')
// var https = require('https')
const server = require("./server");

const port = process.env.PORT || 5000;

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, server).listen(port, () => console.log(`\n** Running on port ${port} **\n`));
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));
