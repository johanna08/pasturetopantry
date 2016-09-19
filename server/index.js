'use strict';

var https = require('https');
var fs = require('fs');

var app = require('./app');
var db = require('./db');

var port = 8080;
var secureConfig = {
  key: fs.readFileSync(__dirname + '/../key.pem'),
  cert: fs.readFileSync(__dirname + '/../cert.pem')
};
var server = https.createServer(secureConfig, app).listen(port, function (err) {
  if (err) throw err;
  console.log('HTTP server patiently listening on port', port);
  db.sync()
  .then(function () {
    console.log('Oh and btw the postgres server is totally connected, too');
  });
});

module.exports = server;
