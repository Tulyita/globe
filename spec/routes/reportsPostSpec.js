'use strict';
/*
var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var reportsPost = require('../../server/routes/reportsPost');

describe('reportsPost', function() {

	beforeEach(function(done) {
		done();
	});

	afterEach(function() {
		mockgoose.reset();
	});

	it('should save a report to mongo', function(done) {
		var req = {
			body: {
				type: 'card',
				data: 'wee',
				fromUser: {
					_id: mongoose.Types.ObjectId(),
					name: 'Jill',
					group: 'u',
					site: 'j'
				}
			}
		};
		reportsPost(req, {apiOut: function(err, resp) {
			expect(err).toBeFalsy();
			expect(resp).toBeTruthy();
			if(resp) {
				expect(resp.type).toEqual('card');
			}
			done();
		}});
	});

	it('should return an error if something goes wrong', function(done) {
		var req = {
			body: {
				hi: 'malformed request'
			}
		};
		reportsPost(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});
});*/