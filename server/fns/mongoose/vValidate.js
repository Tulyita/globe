'use strict';

var _ = require('lodash');



var isSet = function(val) {
	return !_.isNull(val) && !_.isUndefined(val);
};


/**
 * Find values that are truthy in obj1 but falsy in obj2
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Array}
 */
var findHoles = function(obj1, obj2) {
	var holes = [];

	_.each(obj1, function(val, key) {
		if(isSet(obj1[key]) && !isSet(obj2[key])) {
			holes.push(key);
		}
		else if(typeof obj1[key] !== typeof obj2[key]) {
			holes.push(key);
		}
		else if(typeof val === 'object') {
			holes = holes.concat(findHoles(obj1[key], obj2[key]));
		}
	});

	return holes;
};


/**
 * Mongoose sometimes just deletes values instead of returning a validation error
 * This function looks for those deleted values and returns an error if it finds one
 * @param Model
 * @param {Object} data
 * @param {Function} callback
 */
var vValidate = function(Model, data, callback) {
	var doc = new Model(data);
	doc.validate(function(err) {
		if(err) {
			return callback(err);
		}

		var holes = findHoles(data, doc.toObject());
		if(holes.length > 0) {
			return callback('vValidation error: ' + holes.join(','));
		}

		return callback(null, doc.toObject());
	});
};


/**
 * Extends mongoose to make validatedUpdate accessible on every document
 * example: var bike = new Bike({tires: 2}); bike.vValidate(function(err) {};
 * @param mongoose
 */
vValidate.attach = function(mongoose) {
	mongoose.Model.vValidate = function(data, callback) {
		vValidate(this, data, callback);
	};
};


module.exports = vValidate;