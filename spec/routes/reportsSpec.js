'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Report = require('../../server/models/report');
var rpts = require('../../server/routes/reports');

describe('reports', function() {

	
	////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////
	
	describe('post', function() {

		beforeEach(function() {
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
			rpts.post(req, {apiOut: function(err, resp) {
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
			rpts.post(req, {apiOut: function(err) {
				expect(err).toBeTruthy();
				done();
			}});
		});
	});


	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////
	
	describe('get', function() {

		var fromUser, reportId1, reportId2, reportId3;

		beforeEach(function(done) {

			fromUser = {
				_id: mongoose.Types.ObjectId(),
				name: 'Bob',
				site: 'j',
				group: 'u'
			};

			Report.create({type: 'message', data: 'blah', seen: false, fromUser: fromUser, created: new Date(1000)}, function(err, doc) {
				reportId1 = doc._id;

				Report.create({type: 'card', data: 'card', seen: true, fromUser: fromUser, created: new Date(2000)}, function(err, doc) {
					reportId2 = doc._id;

					Report.create({type: 'chat', data: ['chat1', 'chat2'], seen: false, fromUser: fromUser, created: new Date(3000)}, function(err, doc) {
						reportId3 = doc._id;

						done();
					});
				});
			});
		});

		afterEach(function() {
			mockgoose.reset();
		});

		it('should reply with a list of unseen reports if no reportId is present', function(done) {
			var req = {
				body: {}
			};
			rpts.get(req, {apiOut: function(err, response) {
				expect(err).toBeFalsy();
				expect(response[0]._id).toEqual(reportId3);
				expect(response[1]._id).toEqual(reportId1);
				done();
			}});
		});

		it('should reply with a report if its reportId is present', function(done) {
			var req = {
				body: {
					reportId: reportId2
				}
			};
			rpts.get(req, {apiOut: function(err, response) {
				expect(err).toBeFalsy();
				expect(response._id).toEqual(reportId2);
				done();
			}});
		});
	});
});