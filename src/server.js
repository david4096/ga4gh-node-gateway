// This file connects grpc and express interfaces by reflecting
// on the service descriptions in protocol buffers. Start by running
// `node src/server.js`.

var bodyParser = require('body-parser'),
    express = require('express'),
    expressWinston = require('express-winston'),
    grpc = require('grpc'),
    winston = require('winston');

var protocol = require('ga4gh-schemas'),
    config = require('../config'),
    router = require('./router'),
    rpc = require('./rpc');

exports.main = function (options) {
  if (!options) {
    console.log('no options using base controller')
    rpc.setController(require('ga4gh-base-controller'), {});
    options = config;
  }
  var descriptors = protocol.loadDescriptors();
  if (typeof options.controller !== "undefined") {
    console.log('try setting a controller')
    try {
      rpc.setController(options.controller);
    } catch(e) {
      console.log("Failed to load controller from options, using ga4gh-base-controller")
      rpc.setController(require('ga4gh-base-controller'));
    }
  }

  // Set up grpc services and attach methods
  // TODO refactor to use protocol.services
  var server = rpc.loadServer(descriptors);
  server.bind(options.grpc.host + ':' + options.grpc.port, grpc.ServerCredentials.createInsecure());
  server.start();

  // Set up express endpoints and attach the methods.
  var app = express();
  app.use(bodyParser.json());
  // TODO make logging transports configurable either in config.js or some other convention
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
  // Attach the routes to the express app
  app.use(router.router(protocol.services()));
  // Set up error logging
  // TODO make logging transports configurable either in config.js or some other convention
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ]
  }));
  app.listen(options.http.port, function () {
    // TODO remove in favor of unified debug logging
    console.log('Example app listening on port ' + options.http.port);
  });
};

// When the module is run directly, we should execute main.
if (require.main === module) {
  exports.main();
}
