process.env.APP_KEY = process.env.APP_KEY || 'video-service';
process.env.APP_STUBBED = process.env.APP_STUBBED || false;
process.env.APP_DEBUG = process.env.APP_DEBUG || false;
process.env.APP_ENV = process.env.APP_ENV || 'sit';
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.title = process.env.APP_KEY;
process.on('uncaughtException', (e) => {
    throw e;
});
require('babel-polyfill');
require('babel-register')();
require('./logger');
require('./apm');

const server = require('./app/server').default;

server();
