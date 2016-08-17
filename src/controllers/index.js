var variants = require('./variants');
var features = require('./features');
var metadata = require('./metadata');
var extend = require('util')._extend;

module.exports = extend(metadata, extend(variants, features))