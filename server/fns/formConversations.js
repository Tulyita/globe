'use strict';

var _ = require('lodash');


var formConversations = function(userId, messages) {
	var convos = {};

	_.each(messages, function(message) {
		var otherUserId;
		if(String(message.fromUser._id) === String(userId)) {
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
};


module.exports = formConversations;