'use strict';

var _ = require('lodash');
var formConversations = require('../fns/formConversations');

module.exports = {

	get: function(req, res) {
		var convos = formConversations(req.myself._id, req.myself.messages);

		// create an array of only the most recent message in each conversation
		var arr = _.map(convos, function(convo) {
			return convo.slice(convo.length-1, convo.length);
		});

		// sort by recentness
		arr =	_.sortBy(arr, 'date');

		// output
		res.apiOut(null, arr);
	}
};