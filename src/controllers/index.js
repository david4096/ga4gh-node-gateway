var variants = require('./variants');
    features = require('./features');
    metadata = require('./metadata');

var extend = require('util')._extend;

// TODO extend them together nicely instead of the method below
// To make the controllers attached by name all of them must be
// in the same namespace.

module.exports = extend(metadata, extend(variants, features));
