'use strict';

var mongoose = require('mongoose');
var isBans = require('../../server/validators/isBans');

describe('isBans', function() {


	it('should accept an empty array', function() {
		expect(isBans([])).toBe(true);
	});


	it('should accept an array of bans', function() {
		var bans = [
			{
				_id: mongoose.Types.ObjectId(),
				type: 'ban',
				reason: 'rude',
				expireDate: new Date(),
				mod: {
					_id: mongoose.Types.ObjectId(),
					name: 'Bob',
					site: 'j',
					group: 'm'
				}
			},
			{
				_id: mongoose.Types.ObjectId(),
				type: 'silence',
				reason: 'hair',
				expireDate: new Date(),
				mod: {
					_id: mongoose.Types.ObjectId(),
					name: 'Bob',
					site: 'j',
					group: 'm'
				}
			}
		];

		expect(isBans(bans)).toBe(true);
	});


	it('should not accept an array with something other than a ban in it', function() {
		var bans = [
			{
				_id: mongoose.Types.ObjectId(),
				type: 'ban',
				reason: 'rude',
				expireDate: new Date(),
				mod: {
					_id: mongoose.Types.ObjectId(),
					name: 'Bob',
					site: 'j',
					group: 'm'
				}
			},
			{
				haxxors: true
			}
		];

		expect(isBans(bans)).toBe(false);
	});


	it('should not accept non-array values', function() {
		expect(isBans()).toBe(false);
		expect(isBans(null)).toBe(false);
		expect(isBans(-1)).toBe(false);
		expect(isBans('hello there')).toBe(false);
		expect(isBans({hi: true})).toBe(false);
	});
});