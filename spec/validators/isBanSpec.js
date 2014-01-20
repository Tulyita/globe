'use strict';

var isBan = require('../../server/validators/isBan');
var mongoose = require('mongoose');

describe('isBan', function() {


	it('should accept a valid ban', function() {
		var ban = {
			_id: mongoose.Types.ObjectId(),
			type: 'ban',
			expireDate: new Date(),
			reason: 'pidgin',
			mod: {
				_id: mongoose.Types.ObjectId(),
				name: 'felix',
				site: 'j',
				group: 'm'
			}
		};

		expect(isBan(ban)).toBe(true);
	});


	it('should accept optional values', function() {
		var ban = {
			_id: mongoose.Types.ObjectId(),
			type: 'ban',
			expireDate: new Date(),
			reason: 'pidgin',
			ip: '74.125.224.72',
			privateInfo: 'hello',
			publicInfo: [1,2,3],
			mod: {
				_id: mongoose.Types.ObjectId(),
				name: 'felix',
				site: 'j',
				group: 'm'
			}
		};

		expect(isBan(ban)).toBe(true);
	});


	it('should not accept extra values', function() {
		var ban = {
			_id: mongoose.Types.ObjectId(),
			type: 'ban',
			expireDate: new Date(),
			date: new Date(),
			extra: 'lsdfjle',
			mod: {
				_id: mongoose.Types.ObjectId(),
				name: 'felix',
				site: 'j',
				group: 'm'
			}
		};

		expect(isBan(ban)).toBe(false);
	});


});