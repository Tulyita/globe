'use strict';

var _ = require('lodash');


var paginate = function(data, callback) {


	// import data
	var page = data.page || 1;
	var count = data.count || 10;
	var find = data.find ? data.find : {};
	var sort = data.sort ? data.sort : {_id: 1};
	var maxPage = data.maxPage || 50;
	var minPage = data.minPage || 1;
	var maxCount = data.maxCount || 25;
	var allowFindBy = data.allowFindBy || [];
	var allowSortBy = data.allowSortBy || ['_id'];
	callback = callback || data.callback || function() {};


	// parse json
	if(_.isString(find)) {
		find = JSON.parse(find);
	}
	if(_.isString(sort)) {
		sort = JSON.parse(sort);
	}


	// limit fields that can be filtered and sorted on
	find = _.pick(find, allowFindBy);
	sort = _.pick(sort, allowSortBy);


	// limit page range
	page = Math.max(page, minPage);
	page = Math.min(page, maxPage);


	// limit possible count range
	count = Math.max(count, 1);
	count = Math.min(count, maxCount);


	// query for the data
	data.model
		.find(find)
		.skip((page-1)*count)
		.limit(count)
		.sort(sort)
		.exec(function(err, results) {
			if(err) {
				return callback(err);
			}

			// query for the number of pages
			data.model.count(find, function(err, totalItemCount) {
				if(err) {
					return callback(err);
				}

				// return the results
				var pageCount = Math.ceil(totalItemCount / count) || 1;
				return callback(null, {page: page, pageCount: pageCount, results: results});
			});
		});

};

module.exports = paginate;