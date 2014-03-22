'use strict';

var Report = require('../models/report');


module.exports = {


	get: function(req, res) {
		Report.findById(req.params.reportId, res.apiOut);
	},


	post: function(req, res) {
		var seen = req.param('seen');

		Report.findById(req.params.reportId, function(err, report) {
			if(err) {
				return res.apiOut(err);
			}

			report.seen = seen;
			report.save(function(err) {
				res.apiOut(err, report);
			});
		});
	}
};