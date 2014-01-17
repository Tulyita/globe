'use strict';

var Report = require('../models/report');

module.exports = function(req, res) {

	///////////////////////////////////////////
	// return a single report
	///////////////////////////////////////////
	if(req.body.reportId) {
		Report.findById(req.body.reportId, res.apiOut);
	}


	//////////////////////////////////////////
	// return a list of reports
	//////////////////////////////////////////
	else {
		Report.find({seen: false}, {}, {sort: {created: -1}}, res.apiOut);
	}
};