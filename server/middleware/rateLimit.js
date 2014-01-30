var Limiter = require('ratelimiter');
var redisConnect = require('../fns/redisConnect');


var redisClient = redisConnect(process.env.REDIS_URI);

/**
 * Limit how often a user can make a request
 * @param {string} limitGroup
 * @param {number} [max]
 * @param {number} [duration]
 * @returns {Function}
 */
module.exports = function(limitGroup, max, duration) {
	max = max || 5;
	duration = duration || 60000;

	return function(req, res, next) {

		var id = 'globe:' + ":" + limitGroup + ":" + req.session._id;

		var limit = new Limiter({ id: id, db: redisClient, max: max, duration: duration });

		limit.get(function(err, limit) {
			if (err) return next(err);

			res.set('X-RateLimit-Limit', limit.total);
			res.set('X-RateLimit-Remaining', limit.remaining);
			res.set('X-RateLimit-Reset', limit.reset);

			// all good
			if (limit.remaining) return next();

			// not good;
			var delta = (limit.reset * 1000) - Date.now() | 0;
			var after = limit.reset - (Date.now() / 1000) | 0;
			res.set('Retry-After', after);
			return res.send(429, 'Rate limit exceeded, retry in ' + delta / 1000);
		});
	};
};
