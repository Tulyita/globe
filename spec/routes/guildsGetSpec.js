'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Guild = require('../../server/models/guild');
var guildsGet = require('../../server/routes/guildsGet');

describe('guildsGet', function() {

	beforeEach(function(done) {
		Guild.create({
			_id: 'abc'
		}, function(err) {
			done(err)
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});


	it('should return a guild by id', function(done) {
		var req = {
			body: {
				guildId: 'abc'
			}
		};
		guildsGet(req, {apiOut: function(err, res) {
			expect(err).toBeFalsy();
			expect(res._id).toBe('abc');
			done();
		}});
	});


	it('should return an error for bad data', function(done) {
		var req = {
			body: {
				bla: 'bla bla'
			}
		};
		guildsGet(req, {apiOut: function(err, doc) {
			expect(err).toBeTruthy();
			done();
		}});
	});
});