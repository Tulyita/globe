'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ApprenticeSchema = new Schema({
	keeper: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	apprentice: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	date: {
		type: Date,
		default: Date
	}
});

module.exports = ApprenticeSchema;