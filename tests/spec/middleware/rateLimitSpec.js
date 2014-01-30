'use strict';

var sinon = require('sinon');
var rateLimit = require('../../../server/middleware/rateLimit');
var redisConnect = require('../../../server/fns/redisConnect');
var redisClient = redisConnect(process.env.REDIS_URI);

describe('rateLimit', function() {

	beforeEach(function() {

	});

	afterEach(function(done) {
		redisClient.del('limit:globe:test:123', done);
	});

	it('should limit the frequency of requests', function(done) {
		var rl = rateLimit('test', 2, 1000);

		var req = {
			session: {
				_id: '123'
			}
		};
		var res = {
			send: sinon.stub(),
			set: sinon.stub()
		};

		rl(req, res, function(err) {
			expect(err).toBeFalsy();

			res.send = function(code, message) {
				expect(code).toBe(429);
				expect(message).toMatch('Rate limit exceeded');
				done();
			};
			rl(req, res);
		});
	});
});