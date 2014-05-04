'use strict';


module.exports = function(appName, key) {

	if(appName.indexOf('futurism') !== -1 && key === process.env.FUTURISM_KEY && process.env.FUTURISM_KEY) {
		return true;
	}
	else if(appName === 'pr4' && key === process.env.PR4_KEY && process.env.PR4_KEY) {
		return true;
	}

	return false;
};