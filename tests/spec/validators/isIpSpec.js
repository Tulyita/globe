'use strict';

var isIp = require('../../../server/validators/isIp');

describe('isIp', function() {

	it('should accept an ipv4 address', function() {
		expect(isIp('66.249.64.0')).toBe(true);
	});

	it('should accept an ipv6 address', function() {
		expect(isIp('2001:db8:85a3::8a2e:370:7334')).toBe(true);
	});

	it('should not accept anything else', function() {
		expect(isIp(5)).toBe(false);
		expect(isIp({hi:true})).toBe(false);
		expect(isIp('not.an.ip')).toBe(false);
	});
});