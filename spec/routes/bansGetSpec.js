'use strict';

var sinon = require('sinon');
var User = require('../../server/models/user');
var bansGet = require('../../server/routes/bansGet');


describe('bansGet', function() {


	//////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////

	describe('get', function() {

		beforeEach(function() {
			sinon.stub(User, 'findById');
		});

		afterEach(function() {
			User.findById.restore();
		});

		it('should return what mongoose finds', function(done) {
			User.findById
				.withArgs('abc')
				.yields(null, {_id: 'abc',bans: [{name: 'ban1'}, {name: 'ban2'}]});
			var req = {
				body: {userId: 'abc'}
			};
			bansGet(req, {apiOut: function(err, resp) {
				expect(err).toBeFalsy();
				expect(resp.bans).toEqual([{name: 'ban1'}, {name: 'ban2'}]);
				done();
			}});
		});

		it('should return an error if mongoose returns an error', function(done) {
			User.findById
				.withArgs('errorTime')
				.yields('There was a horrible error');
			var req = {
				body: {userId: 'errorTime'}
			};
			bansGet(req, {apiOut: function(err) {
				expect(err).toBeTruthy();
				done();
			}});
		});
	});
});