'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var BanDoc = require('../../../server/models/schemas/banDoc');
var BanSchema = new mongoose.Schema(BanDoc);
var Ban = mongoose.model('BanTest', BanSchema);

var data;


describe('ban', function() {

	beforeEach(function() {
		data = {
			type: 'silence',
			expireDate: new Date(),
			reason: 'spam',
			mod: {
				_id: mongoose.Types.ObjectId(),
				name: 'moddy',
				site: 'j',
				group: 'm'
			}
		}
	});


	describe('date', function() {

		it('should accept a date', function(done) {
			data.date = new Date(0);
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.date).toEqual(new Date(0));
				done();
			});
		});
	});


	describe('expireDate', function() {

		it('should accept a date', function(done) {
			data.expireDate = new Date(0);
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.expireDate).toEqual(new Date(0));
				done();
			});
		});
	});


	describe('mod', function() {

		it('should accept a user', function(done) {
			data.mod = {_id: mongoose.Types.ObjectId(), name:'Sally', site: 'j', group: 'm'};
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.mod.name).toBe('Sally');
				done();
			});
		});
	});


	describe('publicInfo', function() {

		it('should accept anything', function(done) {
			data.publicInfo = 'hi';
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.publicInfo).toEqual('hi');
				done();
			});
		});
	});


	describe('privateInfo', function() {

		it('should accept anything', function(done) {
			data.privateInfo = 'hi';
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.privateInfo).toEqual('hi');
				done();
			});
		});
	});


	describe('ip', function() {

		it('should accept a valid ip', function(done) {
			data.ip = '216.239.51.99';
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.ip).toBe('216.239.51.99');
				done();
			});
		});
	});


	describe('type', function() {

		it('should accept "ban"', function(done) {
			data.type = 'ban';
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.type).toBe('ban');
				done();
			});
		});

		it('should accept "silence"', function(done) {
			data.type = 'silence';
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.type).toBe('silence');
				done();
			});
		});
	});


	describe('reason', function() {

		it('should accept a string', function(done) {
			data.reason = 'pooping';
			Ban.create(data, function(err, doc) {
				expect(err).toBeFalsy();
				expect(doc.reason).toBe('pooping');
				done();
			});
		});
	});
});