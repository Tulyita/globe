'use strict';

var formConversations = require('../../../server/fns/convoFns');
var mongoose = require('mongoose');


describe('formConversations', function() {


	it('should return an empty object if given a falsy value or empty array', function() {
		expect(convoFns('', false)).toEqual({});
		expect(convoFns('', [])).toEqual({});
		expect(convoFns('', {})).toEqual({});
		expect(convoFns('', null)).toEqual({});
	});


	it('should group messages together into conversations', function() {
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
				body: 'message 1 to bob'
			},
			{
				fromUser: me,
				toUser: bob,
				body: 'message 2 to bob'
			},
			{
				fromUser: bob,
				toUser: me,
				body: 'message 1 from bob'
			},
			{
				fromUser: sally,
				toUser: me,
				body: 'message 1 from sally'
			}
		];

		var convos = convoFns(myUserId, messages);

		expect(convos[bobUserId].length).toBe(3);
		expect(convos[bobUserId][0].body).toBe('message 1 to bob');

		expect(convos[sallyUserId].length).toBe(1);
		expect(convos[sallyUserId][0].body).toBe('message 1 from sally');
	});
});