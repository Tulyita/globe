'use strict';

var groups = require('../../server/fns/groups');
var isGroup = require('../../server/validators/isGroup');

describe('isGroup', function() {

	it('should accept groups.GUEST', function() {
		expect(isGroup(groups.GUEST)).toBe(true);
	});

	it('should accept groups.USER', function() {
		expect(isGroup(groups.USER)).toBe(true);
	});

	it('should accept groups.APPRENTICE', function() {
		expect(isGroup(groups.APPRENTICE)).toBe(true);
	});

	it('should accept gorups.MOD', function() {
		expect(isGroup(groups.MOD)).toBe(true);
	});

	it('should accept groups.ADMIN', function() {
		expect(isGroup(groups.ADMIN)).toBe(true);
	});

	it('should not accept anything else', function() {
		expect(isGroup(5)).toBe(false);
		expect(isGroup('hi')).toBe(false);
		expect(isGroup('q')).toBe(false);
		expect(isGroup(['a'])).toBe(false);
	});
});