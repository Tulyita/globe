'use strict';

var _ = require('lodash');
var convoFns = require('../fns/convoFns');


module.exports = {

	get: function(req, res) {
		var convo = convoFns.formConvo(req.session._id, req.params.userId, req.myself.messages);

		if(!convo) {
			return res.apiOut({code: 404, message: 'Conversation not found'});
		}

		var publicConvo = convoFns.copyPublicData(convo);

		convoFns.markConvoRead(convo);
		req.myself.save();

		return res.apiOut(null, publicConvo);
	}
};