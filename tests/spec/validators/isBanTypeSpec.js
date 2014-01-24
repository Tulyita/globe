'use strict';

var isBanType = require('../../../server/validators/isBanType');


describe('isBanType', function() {

	it('should accept "ban"', function() {
		expect(isBanType('ban')).toBe(true);
	});

	it('should accept "silence"', function() {
		expect(isBanType('silence')).toBe(true);
	});

	it('should not accept anything else', function() {
		expect(isBanType(1)).toBe(false);
		expect(isBanType('naw')).toBe(false);
		expect(isBanType()).toBe(false);
		expect(isBanType({hi: true})).toBe(false);
		expect(isBanType(['hi'])).toBe(false);
	});
});
