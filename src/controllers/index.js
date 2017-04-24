var variants = require('./variants');
var features = require('./features');
var  metadata = require('./metadata');
var rna = require('./rna');

var extend = require('util')._extend;

// TODO extend them together nicely instead of the method below
// To make the controllers attached by name all of them must be
// in the same namespace.

module.exports = extend(metadata, extend(rna, variants, features));
