exports.searchVariantAnnotations = function(call, callback) {
  callback(null, {next_page_token: '5'});
};

exports.searchVariantAnnotationSets = function(call, callback) {
  callback(null, {next_page_token: '5'});
};

exports.searchVariants = function(call, callback) {
  callback(null, {next_page_token: '5'});
};

exports.searchVariantAnnotationSets = function(call, callback) {
  callback(null, {next_page_token: '5'});
};

exports.searchVariants = function(call, callback) {
  callback(null, {next_page_token: '3'});
};

// Basic CRUD approach
// People won't be trying to write on the same item at the same time
// usually, writes will be parallelized chunks of files.

exports.addVariantSet = function(call, callback) {
  // Check to see if the dataset exists

  // Check to see if ID in variant set
  // If so update

  // Write variant set record

  // return write response
  callback(null, {created: false});
};

exports.addCallSet = function(call, callback) {
  // Check to see the variant set it's from exists

  // Check to see if ID on callset
  // If so update

  // Write call record

  // return write response
  callback(null, {created: false});
};

exports.addCall = function(call, callback) {
  // Check to see the callset exists

  // create call record

  // return writeresponse
  callback(null, {created: false});
};

exports.addVariant = function(call, callback) {
  // Check to make sure a variant set has been created with the ID

  // Check to see if the variant has an ID on it already

  // Break up the variant message and calls up

  // Check to see

  // Create call records

  callback(null, {created: false});
};
