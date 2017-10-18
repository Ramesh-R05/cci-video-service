process.env.APP_KEY = 'video-service'; // TODO
process.title = process.env.APP_KEY; // TODO
process.on('uncaughtException', function(e) {
    throw e;
});
require("babel-polyfill");
require("babel-register")();
require('./logger');
require('./apm');

var server = require('./app/server').default;

server();
