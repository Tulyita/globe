(function() {
	'use strict';

	module.exports = function(req, res, next) {


		/**
		 * Standard output function for all api calls
		 * @param {*} err
		 * @param {*} [result]
		 */
		res.apiOut = function(err, result) {
			var code, response;

			if(err) {
				code = err.code || 500;
				response = {error: err};
			}
			else {
				code = 200;
				response = result;
			}

			var strResponse = JSON.stringify(response, null, 2);

			return res.send(code, strResponse);
		};


		//
		next();
	};


}());