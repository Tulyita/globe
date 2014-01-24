'use strict';

var isSite = require('../../../server/validators/isSite');
var sites = require('../../../server/fns/sites.js');

describe('isSite', function() {

	it('should accept sites.JIGGMIN', function() {
		expect(isSite(sites.JIGGMIN)).toBe(true);
	});

	it('should accept sites.ARMOR_GAMES', function() {
		expect(isSite(sites.ARMOR_GAMES)).toBe(true);
	});

	it('should accept sites.KONGREGATE', function() {
		expect(isSite(sites.KONGREGATE)).toBe(true);
	});

	it('should accept sites.NEWGROUNDS', function() {
		expect(isSite(sites.NEWGROUNDS)).toBe(true);
	});

	it('should accept sites.FACEBOOK', function() {
		expect(isSite(sites.FACEBOOK)).toBe(true);
	});

	it('should not accept anything else', function() {
		expect(isSite('q')).toBe(false);
		expect(isSite('bob')).toBe(false);
		expect(isSite(true)).toBe(false);
		expect(isSite(['hi'])).toBe(false);
		expect(isSite({hi:true})).toBe(false);
	});
});