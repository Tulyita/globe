'use strict';

var _ = require('lodash');
var convoFns = require('../fns/convoFns');

module.exports = {

	get: function(req, res) {
		var convos = convoFns.formConvos(req.myself._id, req.myself.messages);

		// create an array of only the most recent message in each conversation
		var arr = _.map(convos, function(convo) {
			var mostRecentMessage = convo.slice(convo.length-1, convo.length);
			return convoFns.copyPublicData(mostRecentMessage);
		});

		// sort by recentness
		arr = _.sortBy(arr, 'date').reverse();

		// output
		res.apiOut(null, arr);
	}
};