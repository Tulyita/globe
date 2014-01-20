'use strict';

var isSiteUserId = require('../../server/validators/isSiteUserId');

describe('isSiteUserId', function() {

	it('should accept a one character string', function() {
		expect(isSiteUserId('a')).toBe(true);
	});

	it('should accept a 40 character string', function() {
		expect(isSiteUserId('0000000000111111111122222222223333333333')).toBe(true);
	});

	it('should not accept an empty string', function() {
		expect(isSiteUserId('')).toBe(false);
	});

	it('should not accept a 41 character string', function() {
		expect(isSiteUserId('00000000001111111111222222222233333333334')).toBe(false);
	});

	it('should not accept any non-string value', function() {
		expect(isSiteUserId()).toBe(false);
		expect(isSiteUserId(false)).toBe(false);
		expect(isSiteUserId(13)).toBe(false);
		expect(isSiteUserId(['hi'])).toBe(false);
		expect(isSiteUserId({hi: true})).toBe(false);
	});
});