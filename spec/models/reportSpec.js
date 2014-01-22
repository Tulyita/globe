'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var _ = require('lodash');
var Report = require('../../server/models/report');

describe('report', function() {

	beforeEach(function() {
	});

	afterEach(function() {
		mockgoose.reset();
	});


	describe('validation', function() {

		it('should accept valid values', function(done) {
			var obj = {
				type: 'message',
				data: 1,
				fromUser: {
					_id: mongoose.Types.ObjectId(),
					name: 'Buffy',
					group: 'u',
					site: 'j'
				},
				created: new Date(1),
				seen: true
			};

			Report.create(obj, function(err, report) {
				expect(err).toBeFalsy();

				expect(report.type).toBe(obj.type);
				expect(report.data).toEqual(obj.data);
				expect(report.fromUser).toEqual(obj.fromUser);
				expect(report.created).toEqual(obj.created);
				expect(report.seen).toBe(obj.seen);

				done(err);
			});
		});


		it('should return an error for invalid fields', function(done) {
			var obj = {
				type: 'anything else',
				data: null,
				fromUser: null
			};

			Report.create(obj, function(err) {
				expect(err.name).toBe('ValidationError');
				expect(err).toMatch('type');
				expect(err).toMatch('data');
				expect(err).toMatch('fromUser');
				done();
			});
		});


		it('should typecast or replace invalid values where possible', function(done) {
			var obj = {

				// correct required values
				type: 'message',
				data: 1,
				fromUser: {
					_id: mongoose.Types.ObjectId(),
					name: 'Buffy',
					group: 'u',
					site: 'j'
				},

				// incorrect optional values
				created: [27],
				seen: {haxxor: true}
			};

			Report.create(obj, function(err, report) {
				expect(err).toBeFalsy();

				expect(_.isDate(report.created)).toBe(true);
				expect(report.seen).toBe(false);

				done(err);
			});
		});
	});
});