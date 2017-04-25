// This module allows us to use the configuration setting to switch between
// various controller backends by module name.
//
// It uses the ga4gh-base-controller by default.
var config = require('../config');

var controller;

try {
    controller = require(config.controller);
} catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
        // Re-throw not "Module not found" errors
        console.log("Couldn't find module from config.js, try reinstalling.");
        controller = require('ga4gh-base-controller');
    } else {
      throw(e);
    }

}


module.exports = controller;
