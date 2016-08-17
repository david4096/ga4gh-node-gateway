// Protocol takes a directory that specifies gRPC services in some number
// of files.

var config = require('../config');

var grpc = require('grpc');

var fs = require('fs');

var schemasDir = config.schema_path;
var namespace = 'ga4gh';

function loadProto() {
  return fs.readdirSync(schemasDir + '/' + namespace);
}

function services() {
  var descriptors = loadDescriptors();
  return descriptors.map(function(descriptor) {
      // TODO there is a better way ...
      var keys = Object.keys(descriptor[namespace]).filter(function(key){
        return key.indexOf('Service') != -1;
      });
      return descriptor[namespace][keys[0]];
    });
}

function filterServices() {
  // This is a hack that lets us select for just our service files
  // FIXME by loading all the proto in the directory and selecting on class name
  return loadProto().filter(function(filename) {
      return filename.indexOf('service.proto') != -1;
  });
}

function loadDescriptors() {
  return filterServices().map(function(filename) {
    // FIXME there has to be a better way to include dependencies here
    // Editing the schemas paths was done ...
    return grpc.load({root: schemasDir, file: 'ga4gh/' + filename});
  });
}

module.exports = {loadDescriptors: loadDescriptors, services: services};
