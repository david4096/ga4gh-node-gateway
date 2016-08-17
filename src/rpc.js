var grpc = require('grpc');
var controllers = require('./controllers/index');

// FIXME a hack that is part of allowing mock methods for each service endpoint.
// Could be removed with a better usage of the grpc API for making method maps
var namespace = 'ga4gh';

// Allows us to define methods as we go and hook them up by name to the schemas.
// It should be possible to determine if a method is streaming or not and get it
// from a different controller. No maintaining key-value maps!
function getMethod(methodname) {
  var lower = firstToLower(methodname);
  if (controllers[lower]) {
    return controllers[lower];
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
    })
  });
  return server;
}