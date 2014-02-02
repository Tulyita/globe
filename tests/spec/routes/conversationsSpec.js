'use strict';

var mongoose = require('mongoose');
var conversations = require('../../../server/routes/conversations');


describe('conversations', function() {

	var myself;

	beforeEach(function() {
		var myUserId = mongoose.Types.ObjectId();
		var bobUserId = mongoose.Types.ObjectId();
		var sallyUserId = mongoose.Types.ObjectId();

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

	it('should return a list of your conversations', function(done) {
		var req = {
			myself: myself
		};
		conversations.get(req, {apiOut: function(err, result) {
			expect(result.length).toBe(2);
			expect(result[0].body).toEqual(myself.messages[2].body);
			expect(result[1].body).toEqual(myself.messages[3].body);
			done(err);
		}});
	});
});