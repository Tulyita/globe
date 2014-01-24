/* global describe, it, expect */
'use strict';

var guest = require('../../../../server/fns/auth/guest');

describe('auth/guest', function() {

	describe('ipToName', function() {

		it('should pick a name from names', function() {
			expect(guest.ipToName('1.2.3')).not.toContain('undefined');
		});

		it('should return the same name for the same ip', function() {
			expect(guest.ipToName('11.222.333')).toEqual(guest.ipToName('11.222.333'));
		});

		it('should create different names for different ips', function() {
			expect(guest.ipToName('111')).not.toEqual(guest.ipToName('123'));
		});
	});
});