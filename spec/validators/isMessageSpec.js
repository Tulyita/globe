'use strict';

var mongoose = require('mongoose');
var isMessage = require('../../server/validators/isMessage');

describe('isMessage', function() {

	it('should accept a valid message', function() {
		var message = {
			_id: mongoose.Types.ObjectId(),
			fromUser: {
				_id: mongoose.Types.ObjectId(),
				name: 'Karen',
				site: 'j',
				group: 'g'
			},
			ip: '66.7.217.155',
			body: 'hi',
			date: new Date()
		};

		expect(isMessage(message)).toBe(true);
	});


	it('should not accept an extra value', function() {
		var message = {
			_id: mongoose.Types.ObjectId(),
			fromUserId: mongoose.Types.ObjectId(),
			ip: '66.7.217.155',
			body: 'hi',
			date: new Date(),
			extra: true
		};

		expect(isMessage(message)).toBe(false);
	});
});