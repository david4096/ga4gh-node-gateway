var grpc = require('grpc');
var fs = require('fs');
var protocol = require('./protocol.js');

// Define functions named here as they are in the proto and have them magically executed!
var descriptors = protocol.loadDescriptors();

exports.searchVariantAnnotations = function(call, callback) {
  callback(null, {variant_annotation_set_id: call.request.variant_annotation_set_id});
}

exports.searchVariantAnnotationSets = function(call, callback) {
  callback(null, {"next_page_token": "5"});
}

exports.searchVariants = function(call, callback) {
  callback(null, {"next_page_token": "5"});
}