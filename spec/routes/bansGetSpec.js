'use strict';

///////////////////////////////////////////////////////////////
// mocks
///////////////////////////////////////////////////////////////
var db = {
	abc: {
		_id: 'abc',
		bans: [
			{name: 'ban1'},
			{name: 'ban2'}
		]
	}
};

var MockUser = {
	findById: function(_id, fields, callback) {
		if(_id === 'errorTime') {
			return callback('There was a horrible error');
		}
		return callback(null, db[_id]);
	}
};



////////////////////////////////////////////////////////////////
// dependencies
////////////////////////////////////////////////////////////////
var mockery = require('mockery');
mockery.registerAllowables(['../../server/routes/bansGet']);
mockery.registerMock('../models/user', MockUser);
mockery.enable();

var bansGet = require('../../server/routes/bansGet');

mockery.disable();
mockery.deregisterAll();


////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////
describe('bansGet', function() {

	it('should return what mongoose finds', function(done) {
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
		var req = {
			body: {userId: 'errorTime'}
		};
		bansGet(req, {apiOut: function(err) {
			expect(err).toBeTruthy();
			done();
		}});
	});
});