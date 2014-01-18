/* global describe, it, expect */
'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Ban = require('../../server/models/ban');


describe('ban', function() {

	describe('date', function() {

		it('should accept a date', function(done) {
			Ban.create({date: new Date(0)}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.date).toEqual(new Date(0));
				done();
			});
		});
	});


	describe('expireDate', function() {

		it('should accept a date', function(done) {
			Ban.create({expireDate: new Date(0)}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.expireDate).toEqual(new Date(0));
				done();
			})
		});
	});


	describe('user', function() {

		it('should accept a user', function(done) {
			Ban.create({user: {_id: mongoose.Types.ObjectId(), name:'Liz', site: 'j', group: 'u'}}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.user.name).toBe('Liz');
				done();
			});
		});
	});


	describe('mod', function() {

		it('should accept a mod', function(done) {
			Ban.create({mod: {_id: mongoose.Types.ObjectId(), name:'Sally', site: 'j', group: 'm'}}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.mod.name).toBe('Sally');
				done();
			});
		});

		it('should not accept a user', function(done) {
			Ban.create({mod: {_id: mongoose.Types.ObjectId(), name:'Liz', site: 'j', group: 'u'}}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('publicInfo', function() {

		it('should accept anything', function(done) {
			Ban.create({publicInfo: 'hi'}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.publicInfo).toEqual('hi');
				done();
			});
		});
	});


	describe('privateInfo', function() {

		it('should accept anything', function(done) {
			Ban.create({privateInfo: 'hi'}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.privateInfo).toEqual('hi');
				done();
			});
		});
	});


	describe('ip', function() {

		it('should accept a valid ip', function(done) {
			Ban.create({ip: '216.239.51.99'}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.ip).toBe('216.239.51.99');
				done();
			});
		});
	});


	describe('banIp', function() {

		it('should accept a boolean', function(done) {
			Ban.create({banIp: false}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.banIp).toBe(false);
				done();
			});
		});
	});


	describe('banAccount', function() {

		it('should accept a boolean', function(done) {
			Ban.create({banAccount: false}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.banAccount).toBe(false);
				done();
			});
		});
	});


	describe('type', function() {

		it('should accept "ban"', function(done) {
			Ban.create({type: 'ban'}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.type).toBe('ban');
				done();
			});
		});

		it('should accept "silence"', function(done) {
			Ban.create({type: 'silence'}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.type).toBe('silence');
				done();
			});
		});
	});


	describe('reason', function() {

		it('should accept a string', function(done) {
			Ban.create({reason: 'pooping'}, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.reason).toBe('pooping');
				done();
			});
		});
	});
});