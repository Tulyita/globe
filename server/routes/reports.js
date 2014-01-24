'use strict';

var Report = require('../models/report');

var rpts = {};


/**
 *
 * @param req
 * @param res
 */
rpts.get = function(req, res) {

	// return a single report
	if(req.body.reportId) {
		Report.findById(req.body.reportId, res.apiOut);
	}

	// return a list of reports
	else {
		Report.find({seen: false}, {}, {sort: {created: -1}}, res.apiOut);
	}
};


/**
 *
 * @param req
 * @param res
 */
rpts.post = function(req, res) {
	Report.create(req.body, res.apiOut);
};


module.exports = rpts;