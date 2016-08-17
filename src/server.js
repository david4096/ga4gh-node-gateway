var grpc = require('grpc');
var protocol = require('./protocol');
var middleware = require('./middleware');
var rpc = require('./rpc');
var express = require('express');

var bodyParser = require('body-parser');

var config = require('../config')

// This file connects grpc, express, and the controller functions by reflecting
// on the service descriptions in protocol buffers.

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
  app.use(middleware.createProxy(protocol.services()));
  
  app.listen(config.http.port, function () {
    console.log('Example app listening on port ' + config.http.port);
  });
}

if (require.main === module) {
  exports.main();
}


