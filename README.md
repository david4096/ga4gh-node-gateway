# ga4gh-node-server

The goal of this project is to minimize the amount of effort required for modifications to the GA4GH schemas to result in usable software. It does not attempt to be a large scale genomics server, but a testing ground for query patterns and message structures.

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