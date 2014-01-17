'use strict';

var Report = require('../models/report');

module.exports = function(req, res) {

	Report.create(req.body, res.apiOut);
};