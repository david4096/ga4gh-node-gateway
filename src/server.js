var grpc = require('grpc');
var fs = require('fs');
var controllers = require('./controllers');
var protocol = require('./protocol');

var namespace = 'ga4gh';

// FIXME a hack that is part of allowing mock methods for each service endpoint.
// Could be removed with a better usage of the grpc API for making method maps
var namespace = 'ga4gh';


function firstToLower(str) {
  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  return str[0].toLowerCase() + str.substring(1)
}

// Allows us to define methods as we go and hook them up by name to the schemas.
// It should be possible to determine if a method is streaming or not and get it from a different
// controller.
function getMethod(methodname) {
  if (controllers[methodname]) {
    return controllers[methodname];
  } else {
    return function(call, callback) {
      // By default we print an empty response and log to the command line.
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

function loadServer() {
  var descriptors = protocol.loadDescriptors();
  var server = new grpc.Server();
  descriptors.forEach(function(descriptor) {
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

if (require.main === module) {
  var server = loadServer();
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  
  // OK so the grpc works more or less let's see about setting up some kind of proxy
  var descriptors = protocol.loadDescriptors();
  var services = descriptors.map(function(descriptor) {
    var keys = Object.keys(descriptor[namespace]).filter(function(key){
      return key.indexOf('Service') != -1;
    });
    return keys[0];
  })
  console.log(services);
  // TODO HTTP proxy
  // Can get the URLs this way
  // We'll make them for each service
  //console.log(descriptors);
  var url = descriptors[0][namespace][services[0]].service.children[0].options['(google.api.http).post'];
  //console.log(descriptors[0][namespace][services[0]].service.children[0].options['(google.api.http).post'])
  var express = require('express');
  var app = express();
  // TODO Dynamically generate routes... it's not as pretty as swagger but fewer moving parts
  app.post(url, function (req, res) {
    res.send('Hello World!');
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
}


