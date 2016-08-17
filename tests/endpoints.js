var chakram = require('chakram'),
    expect = chakram.expect,
    protocol = require('../src/protocol')
    config = require('../config');

var baseurl = 'http://localhost:' + config.http.port;

var namespace = 'ga4gh';

var services = protocol.services();

// Check to see if there are endpoints
services.forEach(function(service) {
  describe(service.name, function() {
    service.service.children.forEach(function(method) {
      if (method.options['(google.api.http).post']) {
        it(method.name + " should not return a 404", function () {
          var response = chakram.post(baseurl + method.options['(google.api.http).post'], {});
          return expect(response).to.not.have.status(404);
        });
      } else {
        var url = method.options['(google.api.http).get'];
        var endpoint = url.substring(0, url.indexOf('{'))  // remove bracketed stuff
        it(method.name + " should not return a 404", function () {
          var response = chakram.get(baseurl + endpoint + 'id');
          return expect(response).to.not.have.status(404);
        });
      }
    });
  });
});
