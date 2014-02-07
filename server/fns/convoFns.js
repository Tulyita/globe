'use strict';

var _ = require('lodash');


var convoFns = {


	markConvoRead: function(convo) {
		_.each(convo, function(message) {
			message.read = true;
		});
	},


	copyPublicData: function(convo) {
		var publicConvo = _.map(convo, function(message) {
			return _.pick(message, 'fromUser', 'toUser', 'body', 'date', 'read');
		});
		return publicConvo;
	},


	formConvo: function(myUserId, theirUserId, messages) {
		var convos = convoFns.formConvos(myUserId, messages);
		var convo = convos[theirUserId];
		return convo;
	},


	formConvos: function(myUserId, messages) {
		var convos = {};

		_.each(messages, function(message) {
			var otherUserId;
			if(String(message.fromUser._id) === String(myUserId)) {
				otherUserId = String(message.toUser._id);
			}
			else {
				otherUserId = String(message.fromUser._id);
			}

			if(!convos[otherUserId]) {
				convos[otherUserId] = [];
			}

			convos[otherUserId].push(message);
		});

		return convos;
	}
};



module.exports = convoFns;