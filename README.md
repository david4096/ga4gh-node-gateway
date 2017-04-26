# ga4gh-node-gateway

This software presents a GRPC and HTTP 1.1 interface according to the GA4GH
schemas. It provides a way to easily attach controllers to access genomics
data.

It relies on Google's [GRPC](http://grpc.io) module, [express](http://expressjs.com/), and the [ga4gh-schemas](https://github.com/ga4gh/ga4gh-schemas).

To use this software, import it into your project and set a controller module
in the options. `npm install ga4gh-node-gateway --save`

```
var gateway = require('ga4gh-node-gateway');
var controller = {};

controller.searchVariants = function(call, callback) {
  callback(null, {variants[{id: 1}]})
}

var options =   {
  grpc: {
    port: 50051,
    host: "0.0.0.0"         // Accept requests from any
  },
  http: {
    port: 3000
  },
  controller: controller
};


gateway.main(options);

```

Your server now has two components, the ga4gh-node-gateway and your controller.
Running main will run the the server forever. For more see [ga4gh-node-server](https://github.com/david4096/ga4gh-node-server), which can
be easily forked to create your own implementation.

You can now make requests to the endpoints that serve the named
method to see your requests fulfilled.

## The joys of node

We don't have to precompile the schemas, so the protocol buffers are generated dynamically! This reduces the gateway and boilerplate significantly (you don't
need protoc to test out schema changes).

If you would like to try out a new data model, simply make changes to the
schemas and reinstall the dependency. The only requirement is that the named
method in the protobuf matches the method name in the controller module.
