'use strict';

var _ = require('lodash');
var convoFns = require('../fns/convoFns');
var Report = require('../models/report');


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
	},


	post: function(req, res) {
		var action = req.param('action');

		if(action === 'report') {

			var convo = convoFns.formConvo(req.session._id, req.params.userId, req.myself.messages);
			if(!convo) {
				return res.apiOut({code: 404, message: 'Conversation not found'});
			}
			var publicConvo = convoFns.copyPublicData(convo);

			var reportData = {
				type: 'convo',
				privateData: publicConvo,
				user: _.pick(req.myself, '_id', 'name', 'group', 'site')
			};

			return Report.create(reportData, function(err) {
				return res.apiOut(err, publicConvo);
			});
		}

		return res.apiOut('action "'+action+'" not found');
	}
};