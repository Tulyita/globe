'use strict';

var Report = require('../models/report');


module.exports = {


	get: function(req, res) {
		Report.findById(req.params.reportId, res.apiOut);
	},


	post: function(req, res) {
		Report.findById(req.params.reportId, function(err, report) {
			if(err) {
				return res.apiOut(err);
			}

			report.seen = true;
			report.save(function(err) {
				if(err) {
					return res.apiOut(err);
				}
				res.apiOut(null, report);
			});
		});
	}
};