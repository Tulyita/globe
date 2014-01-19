'use strict';

var isUrl = require('../../server/validators/isUrl');

describe('isUrl', function() {

	it('should accept a string that starts with http://', function() {
		expect(isUrl('http://test.com')).toBe(true);
	});

	it('should accept a string that starts with https://', function() {
		expect(isUrl('https://test.com')).toBe(true);
	});

	it('should not accept anything else', function() {
		expect(isUrl(['hi'])).toBe(false);
		expect(isUrl({hi:true})).toBe(false);
		expect(isUrl('')).toBe(false);
		expect(isUrl(true)).toBe(false);
		expect(isUrl('not a url')).toBe(false);
	});
});