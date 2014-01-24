'use strict';

var isMessageBody = require('../../../server/validators/isMessageBody');

describe('isMessageBody', function() {

	it('should accept a valid body', function() {
		expect(isMessageBody('hello')).toBe(true);
	});

	it('should not accept a message that is too long', function() {
		var str = new Array(500).join('z');
		expect(isMessageBody(str)).toBe(false);
	});

	it('should reject invalid values', function() {
		expect(isMessageBody()).toBe(false);
		expect(isMessageBody(-1)).toBe(false);
		expect(isMessageBody(['hi'])).toBe(false);
		expect(isMessageBody({hi: true})).toBe(false);
		expect(isMessageBody(true)).toBe(false);
		expect(isMessageBody(0)).toBe(false);
	});
});