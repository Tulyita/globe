'use strict';

var express = require('express');

module.exports = function(globe) {
	globe.use(express.urlencoded());
	globe.use(express.json());
	globe.use(require('./middleware/handleErrors'));
	globe.use(require('./middleware/consolidateQuery'));
	globe.use(require('./middleware/output'));
	globe.use(require('./middleware/continueSession'));
};