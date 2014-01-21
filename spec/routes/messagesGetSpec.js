'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var User = require('../../server/models/user');
var messagesGet = require('../../server/routes/messagesGet');

var messages, fromUserId, toUserId;

describe('messageGet', function() {


	beforeEach(function(done) {
		fromUserId = mongoose.Types.ObjectId();
		toUserId = mongoose.Types.ObjectId();
		messages = [{
			_id: mongoose.Types.ObjectId(),
			fromUser: {
				_id: fromUserId,
				name: 'fred',
				site: 'j',
				group: 'u'
			},
			body: 'hello',
			date: new Date()
		}];

		User.create({
			_id: toUserId,
			name: 'aaaa',
			site: 'j',
			group: 'u',
			siteUserId: 'abc',
			messages: messages
		}, function(err) {
			done(err);
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should return a uer\'s messages', function(done) {
		var req = {
			session: {
				_id: toUserId
			}
		};
		messagesGet.get(req, {apiOut: function(err, res) {
			if(err) {
				return done(err);
			}
			expect(res.toObject()).toEqual(messages);
			return done();
		}});
	});
});