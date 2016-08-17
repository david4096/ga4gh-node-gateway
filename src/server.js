// This file connects grpc and express interfaces by reflecting
// on the service descriptions in protocol buffers.

var bodyParser = require('body-parser'),
    express = require('express'),
    expressWinston = require('express-winston'),
    grpc = require('grpc'),
    winston = require('winston');

var config = require('../config'),
    protocol = require('./protocol'),
    router = require('./router'),
    rpc = require('./rpc');

exports.main = function () {
  var descriptors = protocol.loadDescriptors();
  // Set up grpc services and attach methods
  // TODO refactor to use protocol.services
  var server = rpc.loadServer(descriptors);
  server.bind(config.grpc.host + ':' + config.grpc.port, grpc.ServerCredentials.createInsecure());
  server.start();


  // Set up express endpoints and attach the methods.
  var app = express();
  app.use(bodyParser.json());
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ],
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      // optional: allows to skip some log messages based on request and/or response
      return false;
    }
  }));
  app.use(router.router(protocol.services()));
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ]
  }));
  app.listen(config.http.port, function () {
    console.log('Example app listening on port ' + config.http.port);
  });
};

if (require.main === module) {
  exports.main();
}
