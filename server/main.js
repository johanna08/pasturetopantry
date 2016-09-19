'use strict';
var chalk = require('chalk');
var db = require('./db');
var https = require('https');
const dev = require('./env/development')

var port = 1337;
var secureConfig = {
  key: dev.HTTPSKEY,
  cert: dev.HTTPSCERT
};
// Create a node server instance! cOoL!
var server = require('https').createServer(secureConfig).listen(port, function(err){
    if (err) throw err;
    db.sync()
    .then(createApplication)

    .catch(function (err) {
    console.error(chalk.red(err.stack));
    });
});

var createApplication = function () {
    var app = require('./app')(db);
    server.on('request', app); // Attach the Express application.
    require('./io')(server);   // Attach socket.io.
    console.log('made app')
};
