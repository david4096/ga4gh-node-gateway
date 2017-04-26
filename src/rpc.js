var grpc = require('grpc');


var config = require('../config');
var controllers;

var namespace = config.namespace;

// Allows us to define methods as we go and hook them up by name to the schemas.
// It should be possible to determine if a method is streaming or not and get it
// from a different controller. No maintaining key-value maps!
function getMethod(methodname) {
  console.log(controllers);
  var lower = firstToLower(methodname);
  if (controllers[lower]) {
    return function(call, callback) {
      console.log(call);
      return controllers[lower](call, callback);
    };
  } else {
    return function(call, callback) {
      // By default we print an empty response.
      callback(null, {});
    };
  }
}

// TODO remove this there is a better way of getting methods using
// the grpc library (private api stuff?)
function buildMethodMap(methods) {
  // Makes a fake set of initial methods
  var methodMap = {};
  methods.forEach(function(method) {
    methodMap[firstToLower(method.name)] = getMethod(method.name);
  });
  return methodMap;
}

function firstToLower(str) {
  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  return str[0].toLowerCase() + str.substring(1);
}

// TODO refactor to use protocol.services
exports.loadServer = function(descriptors) {
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
    });
  });
  return server;
};

exports.setController = function(controller) {
  controllers = controller;
}

exports.getMethod = getMethod;
