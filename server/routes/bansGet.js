'use strict';

var Ban = require('../models/ban');

module.exports = function(req, res) {

	///////////////////////////////////////////
	// return a single ban
	///////////////////////////////////////////
	if(req.body.banId) {
		Ban.findById(req.body.banId, res.apiOut);
	}


	//////////////////////////////////////////
	// return a list of bans
	//////////////////////////////////////////
	else {
		Ban.find({}, {}, {sort: {date: -1}}, res.apiOut);
	}
};