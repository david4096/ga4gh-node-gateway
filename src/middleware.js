var express = require('express');
var controllers = require('./controllers/index');

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

function expressHandler(endpoint) {
  return function(req, res) {
    getMethod(endpoint.name)({request: req.body}, function(err, doc) {
      res.send(doc);
      res.end()
    });
  }
}

// We have to handle request parameters differently since they're not in the
// request body.
function expressGetHandler(endpoint) {
  return function(req, res) {
    getMethod(endpoint.name)({request: req.params}, function(err, doc) {
      res.send(doc);
      res.end()
    });
  }
}

function firstToLower(str) {
  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  return str[0].toLowerCase() + str.substring(1);
}

// TODO use http descriptor proto to keep version parity, instead of hardcoding
//     key values "(google.api.http).post"
exports.createProxy = function(services) {
  var router = express.Router();
  var endpoints = [];
  // Reflect on the service keys to generate HTTP endpoints
  Object.keys(services).forEach(function(name, i) {
    services[name].service.children.forEach(function(endpoint) {
      if (endpoint.options['(google.api.http).post']) {
        endpoints.push({url: endpoint.options['(google.api.http).post'], method: 'post'})
        router.post(endpoint.options['(google.api.http).post'], expressHandler(endpoint));
      } else {
        // FIXME remove this ugly hack that parses URL variables /variants/{variant_id}
        var url = endpoint.options['(google.api.http).get'].replace('{',':').replace('}','');
        endpoints.push({url: url, method: 'get'})
        router.get(url, expressGetHandler(endpoint));
      }
    });
  });
  // A default endpoint that returns the loaded routes
  router.get('/endpoints', function(req, res) {
    res.send({endpoints: endpoints});
  })
  return router;
}