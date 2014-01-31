'use strict';

var User = require('../models/user');
var paginate = require('mongoose-paginate');


module.exports = {

	get: function(req, res) {

		var page = req.param('page') || 0;
		var count = req.param('count') || 10;

		User.paginate({}, User.publicFields, page, count, function(error, pageCount, paginatedResults) {
			if (error) {
				console.error(error);
			} else {
				console.log('Pages:', pageCount);
				console.log(paginatedResults);
			}
		});
	}
};