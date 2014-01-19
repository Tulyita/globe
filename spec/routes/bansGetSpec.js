/* global describe, expect, it, beforeEach, afterEach */
'use strict';
/*
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Ban = require('../../server/models/ban');
var bansGet = require('../../server/routes/bansGet');

describe('bansGet', function() {

	var ban1, ban2;


	beforeEach(function(done) {

		ban1 = {
			_id: mongoose.Types.ObjectId(),
			type: 'ban',
			user: {
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u'
			},
			mod: {
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'm'
			},
			date: new Date(1000)
		};

		ban2 = {
			_id: mongoose.Types.ObjectId(),
			type: 'ban',
			user: {
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'u'
			},
			mod: {
				_id: mongoose.Types.ObjectId(),
				name: 'aaaa',
				site: 'j',
				group: 'm'
			},
			date: new Date(2000)
		};

		Ban.create(ban1, function() {
			Ban.create(ban2, function() {
				done();
			});
		});
	});


	afterEach(function() {
		mockgoose.reset();
	});


	it('should reply with a list bans if no banId is present', function(done) {
		var req = {
			body: {}
		};
		bansGet(req, {apiOut: function(err, response) {
			expect(err).toBeFalsy();
			expect(response[0]._id).toEqual(ban2._id);
			expect(response[1]._id).toEqual(ban1._id);
			done();
		}});
	});


	it('should reply with a ban if its banId is present', function(done) {
		var req = {
			body: {
				banId: ban2._id
			}
		};
		bansGet(req, {apiOut: function(err, response) {
			expect(err).toBeFalsy();
			expect(response._id).toEqual(ban2._id);
			done();
		}});
	});
});*/