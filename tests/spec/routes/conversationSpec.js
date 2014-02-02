'use strict';

var mongoose = require('mongoose');
var conversation = require('../../../server/routes/conversation');


describe('conversation', function() {

	var myself, bobUserId, sallyUserId;

	beforeEach(function() {
		var myUserId = mongoose.Types.ObjectId();
		bobUserId = mongoose.Types.ObjectId();
		sallyUserId = mongoose.Types.ObjectId();

		var me = {
			_id: myUserId,
			name: 'me',
			group: 'a',
			site: 'k'
		};
		var bob = {
			_id: bobUserId,
			name: 'bob',
			group: 'g',
			site: 'j'
		};
		var sally = {
			_id: sallyUserId,
			name: 'sally',
			group: 'u',
			site: 'a'
		};

		var messages = [
			{
				fromUser: me,
				toUser: bob,
				body: 'message 1 to bob',
				date: new Date(1000)
			},
			{
				fromUser: me,
				toUser: bob,
				body: 'message 2 to bob',
				date: new Date(2000)
			},
			{
				fromUser: bob,
				toUser: me,
				body: 'message 1 from bob',
				date: new Date(3000)
			},
			{
				fromUser: sally,
				toUser: me,
				body: 'message 1 from sally',
				date: new Date(4000)
			}
		];

		myself = {
			_id: myUserId,
			messages: messages
		};
	});

	afterEach(function() {

	});

	it('should return a full conversation by userId', function(done) {
		var req = {
			myself: myself,
			params: {
				userId: bobUserId
			}
		};
		conversation.get(req, {apiOut: function(err, result) {
			expect(result.length).toBe(3);
			expect(result[0].body).toEqual(myself.messages[0].body);
			expect(result[2].body).toEqual(myself.messages[2].body);
			done(err);
		}});
	});

	it('should return a conversation with a single message', function(done) {
		var req = {
			myself: myself,
			params: {
				userId: sallyUserId
			}
		};
		conversation.get(req, {apiOut: function(err, result) {
			expect(result.length).toBe(1);
			expect(result[0].body).toEqual(myself.messages[3].body);
			done(err);
		}});
	});

	it('should return 404 if conversation does not exist', function(done) {
		var req = {
			myself: myself,
			params: {
				userId: 'doesnotexit'
			}
		};
		conversation.get(req, {apiOut: function(err, result) {
			expect(err.code).toBe(404);
			done();
		}});
	});
});