/* global describe, expect, it */
'use strict';

/////////////////////////////////////////////////////////////
// mocks
/////////////////////////////////////////////////////////////
var mockAuth = {
	authenticate: function(data, callback) {
		mockAuth.data = data;
		return callback(null, {
			name: 'Bob',
			site: 'g',
			siteUserId: '123',
			group: 'u'
		});
	}
};

var mockUser = {
	findOneAndSave: function(conditions, data, callback) {
		mockUser.data = data;
		data._id = '555';
		return callback(null, data);
	}
};

var mockRedisSession = {
	make: function(_id, data, callback) {
		mockRedisSession.store[_id] = data;
		return callback(null, 'OK', '555-token');
	},
	store: {}
};


////////////////////////////////////////////////////////////////////
// require dependencies
////////////////////////////////////////////////////////////////////
var mockery = require('mockery');
mockery.enable();
mockery.registerAllowables(['lodash', '../fns/sites', '../../server/routes/tokensGet']);
mockery.registerMock('../fns/redisSession', mockRedisSession);
mockery.registerMock('../models/user', mockUser);
mockery.registerMock('../fns/auth/guest', mockAuth);
mockery.registerMock('../fns/auth/facebook', mockAuth);
mockery.registerMock('../fns/auth/jigg', mockAuth);
mockery.registerMock('../fns/auth/kong', mockAuth);

var tokensGet = require('../../server/routes/tokensGet');

mockery.disable();
mockery.deregisterAll();


/////////////////////////////////////////////////////////////////////////
// tests
/////////////////////////////////////////////////////////////////////////
describe('tokensGet', function() {

	it('should pass a request on to an auth service', function() {
		var req = {
			body: {
				site: 'k',
				kongCode: '123'
			}
		};
		tokensGet(req, {apiOut: function(err, reply) {
			expect(err).toBeFalsy();
			expect(mockAuth.data.kongCode).toBe('123');
			expect(mockUser.data.name).toBe('Bob');
			expect(mockRedisSession.store['555'].name).toBe('Bob');
			expect(reply.token).toBe('555-token');
		}});
	});
});