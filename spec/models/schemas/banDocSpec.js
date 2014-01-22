'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var BanDoc = require('../../../server/models/schemas/banDoc');
var BanSchema = new mongoose.Schema(BanDoc);
var Ban = mongoose.model('BanTest', BanSchema);


describe('ban', function() {

	beforeEach(function() {
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('validation', function() {


		it('should accept valid values', function(done) {
			var obj = {

				//required
				type: 'silence',
				expireDate: new Date(75),
				reason: 'spam',
				mod: {
					_id: mongoose.Types.ObjectId(),
					name: 'moddy',
					site: 'j',
					group: 'm'
				},

				//optional
				date: new Date(3),
				publicInfo: 'hi',
				privateInfo: 'hello',
				ip: '216.239.51.99'
			};

			Ban.create(obj, function(err, ban) {
				expect(err).toBeFalsy();
				expect(ban.type).toBe(obj.type);
				expect(ban.expireDate).toBe(obj.expireDate);
				expect(ban.reason).toBe(obj.reason);
				expect(ban.mod).toBe(obj.mod);
				expect(ban.date).toBe(obj.date);
				expect(ban.publicInfo).toBe(obj.publicInfo);
				expect(ban.privateInfo).toBe(obj.privateInfo);
				expect(ban.ip).toBe(obj.ip);
				done(err);
			});
		});


		it('should return an error for invalid values', function(done) {
			var obj = {
				type: 'hahaha',
				expireDate: null,
				reason: null,
				mod: null
			};

			Ban.create(obj, function(err) {
				err = JSON.stringify(err);
				expect(err).toMatch('ValidationError');
				expect(err).toMatch('type');
				expect(err).toMatch('expireDate');
				expect(err).toMatch('reason');
				expect(err).toMatch('mod');
				done();
			});
		});


		it('should fix what it can using typecasting and defaults', function(done) {
			var obj = {

				// required valid values
				type: 'silence',
				expireDate: 15,
				reason: 'spam',
				mod: {
					_id: mongoose.Types.ObjectId(),
					name: 'moddy',
					site: 'j',
					group: 'm'
				}

				// invalid values

			};

			Ban.create(obj, function(err, ban) {
				expect(err).toBeFalsy();
				expect(_.isDate(ban.expireDate)).toBe(true);
				done(err);
			});
		});
	});
});