'use strict';

var _ = require('lodash');
var formConversations = require('../fns/formConversations');

module.exports = {

	get: function(req, res) {
		var convos = formConversations(req.myself._id, req.myself.messages);
		var convo = convos[req.params.userId];

		if(!convo) {
			return res.apiOut({code: 404, message: 'Conversation not found'});
		}

		return res.apiOut(null, convo);
	}
};