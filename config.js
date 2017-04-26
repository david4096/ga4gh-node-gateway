// This configuration file is a plain JavaScript module that lets you define
// many environments, but export only one.
// To change to production, alter the exports of this file.

// There are different ways to serve genomics data. This software allows you
// to define multiple backends by adding a string value here which allows you
// to select a module, by name, that can respond to GA4GH requests.
var backends = [
  "xena",
  "couchdb"
];

var development = {
  namespace: 'ga4gh',
  grpc: {
    port: 50051,
    host: "0.0.0.0"         // Accept requests from any
  },
  http: {
    port: 3000
  }
};

var production = {
  namespace: 'ga4gh',
  grpc: {
    port: 50051,
    host: "0.0.0.0"         // Accept requests from any
  },
  http: {
    port: 8080
  }
};

if (process.env.NODE_ENV == 'production') {
  module.exports = production;
} else {
  module.exports = development;
}
