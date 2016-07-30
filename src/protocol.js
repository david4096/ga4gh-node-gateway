var grpc = require('grpc');
var fs = require('fs');

var schemasDir = '/Users/david/ga4gh-node-server/schemas/src/main/proto';
var namespace = 'ga4gh';

function loadProto() {
  return fs.readdirSync(schemasDir + '/ga4gh');
}

function filterServices() {
  // This is a hack that lets us select for just our service files
  // FIXME by loading all the proto in the directory and selecting on class name
  return loadProto().filter(function(filename) {
      return filename.indexOf('service.proto') != -1;
  })
}

function loadDescriptors() {
  return filterServices().map(function(filename) {
    // FIXME there has to be a better way to include dependencies here
    // Editing the schemas paths was done ...
    return grpc.load({root: schemasDir, file: 'ga4gh/' + filename});
  });
}

module.exports = {loadDescriptors: loadDescriptors}