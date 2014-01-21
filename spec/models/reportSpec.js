'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Report = require('../../server/models/report');
var obj;

describe('report', function() {

	beforeEach(function() {
		obj = {
			type: 'message',
			data: {},
			fromUser: {
				_id: mongoose.Types.ObjectId(),
				name: 'Buffy',
				group: 'u',
				site: 'j'
			}
		};
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('type', function() {

		it('should accept message', function(done) {
			obj.type = 'message';
			Report.create(obj, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should accept chat', function(done) {
			obj.type = 'chat';
			Report.create(obj, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should accept card', function(done) {
			obj.type = 'card';
			Report.create(obj, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept anything else', function(done) {
			obj.type = 'anything else';
			Report.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});

		it('should be required', function(done) {
			delete obj.type;
			Report.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('data', function() {

		it('should accept any value', function(done) {
			obj.data = 1;
			Report.create(obj, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should not accept null', function(done) {
			obj.data = null;
			Report.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});


	describe('fromUser', function() {

		it('should be required', function(done) {
			delete obj.fromUser;
			Report.create(obj, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});
});