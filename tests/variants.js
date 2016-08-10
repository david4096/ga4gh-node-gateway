var chakram = require('chakram'),
    expect = chakram.expect,
    protocol = require('../src/protocol');

var baseurl = 'http://localhost:3000';

var namespace = 'ga4gh';

var services = protocol.services();

console.log(services);

describe("Variant Service", function() {
    it("list variant sets", function () {
        var response = chakram.post(baseurl);
        return expect(response).to.have.status(200);
    });
});