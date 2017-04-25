// Takes a list of protocol buffers service descriptors and provides express
// route handlers with callbacks bound to the named RPC methods. These are
// defined in `controllers` and are the lower-cased name of the function as
// described in the schemas.

var express = require('express');

var controllers = require('./controller');
var rpc = require('./rpc');

// Returns an express handler for post messages by getting the method by
// name from the controller module.
function expressHandler(endpoint) {
  // TODO add a middleware that deserializes the request body's camelcased
  // names into the protobuf
  // TODO refactor to provide controller functions with the complete request
  // and result objects so controllers can write streams.
  // TODO add error handling
  return function(req, res) {
    rpc.getMethod(endpoint.name)({request: req.body}, function(err, doc) {
      res.send(doc);
      res.end();
    });
  };
}

// Returns a callback that will be sent to the controller function when a
// GET endpoint is requested.
function expressGetHandler(endpoint) {
  return function(req, res) {
    // We have to handle request parameters differently since they're not in the
    // request body.
    rpc.getMethod(endpoint.name)({request: req.params}, function(err, doc) {
      res.send(doc);
      res.end();
    });
  };
}

// Lower-cases the first character to generate the proper method names
// `SearchVariants` -> `searchVariants`
function firstToLower(str) {
  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  return str[0].toLowerCase() + str.substring(1);
}

// Public method for generating a list of routes based on protobuf service descriptors.
// app.use(router.router(services));
exports.router = function(services) {
  var router = express.Router();
  var endpoints = [];
  // Reflect on the service keys to generate HTTP endpoints
  Object.keys(services).forEach(function(name, i) {
    services[name].service.children.forEach(function(endpoint) {
      // TODO use http descriptor proto to keep version parity, instead of hardcoding
      //     key values "(google.api.http).post"
      if (endpoint.options['(google.api.http).post']) {
        endpoints.push({url: endpoint.options['(google.api.http).post'], method: 'post'});
        router.post(endpoint.options['(google.api.http).post'], expressHandler(endpoint));
      } else {
        // FIXME remove this ugly hack that parses URL variables /variants/{variant_id}
        var url = endpoint.options['(google.api.http).get'].replace('{', ':').replace('}', '');
        endpoints.push({url: url, method: 'get'});
        router.get(url, expressGetHandler(endpoint));
      }
    });
  });
  // Assist with API discovery...
  // TODO use a standard format for this as opposed to the custom endpoint descriptions
  // A default endpoint that returns the loaded routes.
  router.get('/endpoints', function(req, res) {
    res.send({endpoints: endpoints});
  });
  return router;
};
