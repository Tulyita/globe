'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var IpBan = require('../../../server/models/ipBan');

describe('IpBan', function() {

	beforeEach(function() {
	});

	afterEach(function() {
		mockgoose.reset();
	});

	it('should accept valid values', function() {
		var data = {
			_id: mongoose.Types.ObjectId(),
			ip: '75.98.92.205',
			date: new Date()
		};
		IpBan.create(data, function(err, ban) {
			expect(err).toBeFalsy();
			expect(ban._id).toBe(data._id);
			expect(ban.ip).toBe(data.ip);
			expect(ban.date).toEqual(data.date);
		});
	});
});