# ga4gh-node-gateway

This software presents a GRPC and HTTP 1.1 interface according to the GA4GH
schemas. It provides a way to easily attach controllers to access genomics
data.

It relies on Google's GRPC module, express, and the GA4GH schemas.

To use this software, name a module in the `config.js` that exposes functions
named as they are in the GA4GH schemas.

```
function mycontoller = {};

mycontroller.SearchVariants = function(call, callback) {
  callback(null, {variants: [{id: 1}]})
}

module.exports = mycontroller;
```

Your server now has two components, the ga4gh-node-gateway and your controller.
Simply start the server and make requests to the endpoints that serve the named
method to see your requests fulfilled.

If there is a way to generate code, let's find it!

## The joys of node

We don't have to precompile the schemas, so the protocol buffers are generated dynamically! This reduces the gateway and boilerplate significantly. Don't worry, it will come back to get us when we want a reverse proxy (probably).

## How to use

Run `npm install` then `npm start` and then to see which endpoints your service makes available visit: [http://localhost:3000/endpoints](http://localhost:3000/endpoints).

A submodule of the schemas have been added that is tweaked to support this environment. Mainly, the include paths for protobuf.js need to be made available differently than protoc.

Run `npm start` and make a schema change. Notice that the project recompiles and executes based on your changes, instantly revealing errors or warnings.

What works (or doesn't)?

* Each GA4GH RPC endpoint gives empty responses. An example is available in `src/client.js`.
* Writing code that matches the RPC signature in the .proto in `src/controllers.js` allows one to immediately prototype queries.
