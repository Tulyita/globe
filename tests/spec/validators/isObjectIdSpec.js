'use strict';

var isObjectId = require('../../../server/validators/isObjectId');
var mongoose = require('mongoose');

describe('isObjectId', function() {

	it('should accept an objectId', function() {
		expect(isObjectId(mongoose.Types.ObjectId())).toBe(true);
	});

	it('should reject anything else', function() {
		expect(isObjectId('hello')).toBe(false);
		expect(isObjectId({'hi': true})).toBe(false);
		expect(isObjectId(53)).toBe(false);
		expect(isObjectId(['hi'])).toBe(false);
		expect(isObjectId(true)).toBe(false);
	});
});