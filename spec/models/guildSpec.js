'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var Guild = require('../../server/models/guild');
var obj;

describe('guild', function() {

	beforeEach(function() {
		obj = {
			name: 'best guild!',
			join: 'inviteOnly'
		};
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('name', function() {

		it('should accept a valid name', function(done) {
			obj.name = 'birds';
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.name).toBe('birds');
				done();
			});
		});

		it('should not accept an invalid name', function(done) {
			obj.name = '';
			Guild.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('join', function() {

		it('should accept inviteOnly', function(done) {
			obj.join = 'inviteOnly';
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.join).toBe('inviteOnly');
				done();
			});
		});

		it('should accept requestToJoin', function(done) {
			obj.join = 'requestToJoin';
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.join).toBe('requestToJoin');
				done();
			});
		});

		it('should accept allWelcome', function(done) {
			obj.join = 'allWelcome';
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.join).toBe('allWelcome');
				done();
			});
		});

		it('should not accept an invalid value', function(done) {
			obj.join = {haxxor: true};
			Guild.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('createdDate', function() {
		it('should accept a valid date', function(done) {
			obj.createdDate = new Date(1);
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.createdDate).toEqual(new Date(1));
				done();
			});
		});

		it('should replace invalid date with default', function(done) {
			obj.createdDate = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(_.isDate(doc.createdDate)).toBeTruthy();
				done();
			});
		});
	});


	describe('activeDate', function() {
		it('should accept a valid date', function(done) {
			obj.activeDate = new Date(1);
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.activeDate).toEqual(new Date(1));
				done();
			});
		});

		it('should replace invalid date with default', function(done) {
			obj.activeDate = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(_.isDate(doc.activeDate)).toBeTruthy();
				done();
			});
		});
	});


	describe('hasBanner', function() {
		it('should accept a valid boolean', function(done) {
			obj.hasBanner = true;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.hasBanner).toEqual(true);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.hasBanner = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.hasBanner).toBe(false);
				done();
			});
		});
	});


	describe('gp', function() {
		it('should accept a valid value', function(done) {
			obj.gp = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gp).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gp = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gp).toBe(0);
				done();
			});
		});
	});


	describe('gpDay', function() {
		it('should accept a valid value', function(done) {
			obj.gpDay = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gpDay).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gpDay = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gpDay).toBe(0);
				done();
			});
		});
	});


	describe('gpWeek', function() {
		it('should accept a valid value', function(done) {
			obj.gpWeek = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gpWeek).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gpWeek = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gpWeek).toBe(0);
				done();
			});
		});
	});


	describe('gpLifetime', function() {
		it('should accept a valid value', function(done) {
			obj.gpLifetime = 3;
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.gpLifetime).toBe(3);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.gpLifetime = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.gpLifetime).toBe(0);
				done();
			});
		});
	});


	describe('invitations', function() {
		it('should accept an empty array', function(done) {
			obj.owners = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.owners.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.owners = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.owners.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('members', function() {
		it('should accept an empty array', function(done) {
			obj.members = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.members.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.members = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.members.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('joinRequests', function() {
		it('should accept an empty array', function(done) {
			obj.joinRequests = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.joinRequests.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.joinRequests = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.joinRequests.toObject()).toEqual([]);
				done();
			});
		});
	});


	describe('invitations', function() {
		it('should accept an empty array', function(done) {
			obj.invitations = [];
			Guild.create(obj, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.invitations.toObject()).toEqual([]);
				done();
			});
		});

		it('should replace invalid value with default', function(done) {
			obj.invitations = {haxxor: true};
			Guild.create(obj, function(err, doc) {
				expect(doc.invitations.toObject()).toEqual([]);
				done();
			});
		});
	});
});