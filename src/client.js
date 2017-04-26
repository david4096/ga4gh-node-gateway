var fs = require('fs');

var grpc = require('grpc');

var config = require('../config'),
    protocol = require('ga4gh-schemas');

var host = 'localhost:' + config.grpc.port;

var credentials = grpc.credentials.createInsecure();

var clients = protocol.loadDescriptors();

if (require.main === module) {
  var aaac = new clients[0].ga4gh.AlleleAnnotationService(host, credentials);
  setInterval(function() {
    console.log('reqing');
    aaac.searchVariantAnnotations('asd', function(err, res) {
      console.log(res);
    });
    aaac.searchVariantAnnotationSets('asd', function(err, res) {
      console.log(res);
    });
  }, 500);
}
