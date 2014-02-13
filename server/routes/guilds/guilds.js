'use strict';

var Guild = require('../../models/guild');
var _ = require('lodash');

module.exports = {
	get: function(req, res) {

		// import data
		var page = req.body.page || 1;
		var count = req.body.count || 10;
		var find = req.body.find ? JSON.parse(req.body.find) : {};
		var sort = req.body.sort ? JSON.parse(req.body.sort) : {_id: 1};

		// limit page range
		if(page < 1) {
			page = 1;
		}

		// limit possible count range
		if(count > 25) {
			count = 25;
		}

		// limit fields that can be selected on
		find = _.pick(find, 'join');

		// limit fields that can be sorted on
		sort = _.pick(sort, '_id', 'gpDay');

		//
		Guild.paginate(find, page, count, function(err, pageCount, results) {
			if (err) {
				return res.apiOut(err);
			}
			return res.apiOut(null, {pageCount: pageCount, results: results, page: page});
		}, {sortBy: sort});
	}
};