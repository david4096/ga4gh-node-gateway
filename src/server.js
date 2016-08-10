var grpc = require('grpc');
var controllers = require('./controllers');
var protocol = require('./protocol');
var express = require('express');

var bodyParser = require('body-parser');

// FIXME a hack that is part of allowing mock methods for each service endpoint.
// Could be removed with a better usage of the grpc API for making method maps
var namespace = 'ga4gh';


function firstToLower(str) {
  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  return str[0].toLowerCase() + str.substring(1);
}

// Allows us to define methods as we go and hook them up by name to the schemas.
// It should be possible to determine if a method is streaming or not and get it
//from a different controller.
function getMethod(methodname) {
  if (controllers[methodname]) {
    return controllers[methodname];
  } else {
    return function(call, callback) {
      // By default we print an empty response.
      callback(null, {})
    }
  }
}

// TODO remove this there is a better way of getting methods using
// the grpc library (private api stuff?)
function buildMethodMap(methods) {
  // Makes a fake set of initial methods
  var methodMap = {};
  methods.forEach(function(method) {
    methodMap[firstToLower(method.name)] = getMethod(firstToLower(method.name));
  });
  return methodMap;
}

function expressHandler(endpoint) {
  return function(req, res) {
    getMethod(firstToLower(endpoint.name))({request: req.body}, function(err, doc) {
      res.send(doc);
      res.end()
    });
  }
}

// TODO move to a express middleware
// takes the app and protobuf descriptors and add HTTP routes where needed
// TODO use http descriptor proto to keep version parity, instead of hardcoding
//     key values "(google.api.http).post"
function createProxy(app, descriptors) {
  var services = protocol.services();
  // Reflect on the service keys to generate HTTP endpoints
  Object.keys(services).forEach(function(name, i) {
    services[name].service.children.forEach(function(endpoint) {
      if (endpoint.options['(google.api.http).post']) {
        app.post(endpoint.options['(google.api.http).post'], expressHandler(endpoint));
      } else {
        app.get(endpoint.options['(google.api.http).get'], expressHandler(endpoint));
      }
    });
  });
}

function loadServer() {
  var descriptors = protocol.loadDescriptors();
  var server = new grpc.Server();
  descriptors.forEach(function(descriptor) {
    // TODO figure out a better way of filtering out the service descriptors
    // or at least refactor out
    var keys = Object.keys(descriptor[namespace]).filter(function(key){
      return key.indexOf('Service') != -1;
    });
    keys.map(function(key) {
      var methodMap = buildMethodMap(descriptor[namespace][key].service.children);
      server.addProtoService(descriptor[namespace][key].service, methodMap);
    })
  });
  return server;
}

exports.main = function () {
  var server = loadServer();
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  var descriptors = protocol.loadDescriptors();

  
  // Set up express and attach the methods.
  var app = express();
  app.use(bodyParser.json());
  
  createProxy(app, descriptors);
  
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
}

if (require.main === module) {
  exports.main();
}


