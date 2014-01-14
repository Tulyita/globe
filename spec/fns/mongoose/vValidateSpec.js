/* global describe, it, expect, beforeEach */

'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Schema = mongoose.Schema;
var vValidate = require('../../../server/fns/mongoose/vValidate');


var TestSchema = new Schema({
	objectId: {
		type: Schema.Types.ObjectId
	},
	number: {
		type: Number,
		min: 5,
		max: 15
	},
	string: {
		type: String,
		validate: function(val) {
			return val.length < 4;
		}
	},
	array: {
		type: [],
		validate: function(val) {
			return val.length < 3;
		}
	},
	arrayOfObjects: [{
		objectId: Schema.Types.ObjectId,
		number: Number,
		string: String,
		array: [Number]
	}]
});

vValidate.attach(TestSchema);
var Test = mongoose.model('vValidateTest', TestSchema);
var test;


beforeEach(function() {
	test = new Test();
});


describe('vValidate', function() {

	it('should attach vValidate to all documents function', function() {
		expect(test.vValidate).toBeTruthy();
	});

	it('should accept a valid ObjectId', function() {
		test.objectId = new Schema.Types.ObjectId();
		vValidate(test, function(err) {
			expect(err).toBeFalsy();
		});
	});

	it('should return an error if an invalid ObjectId is used', function() {
		test.objectId = 123;
		vValidate(test, function(err) {
			expect(err).toBeTruthy();
		});
	});

	it('should accept a valid number', function() {
		test.number = new Schema.Types.ObjectId();
		vValidate(test, function(err) {
			expect(err).toBeFalsy();
		});
	});

	it('should reject an invalid number', function() {
		test.number = 'hello';
		vValidate(test, function(err) {
			expect(err).toBeTruthy();
		});
	});

	it('should accept a valid string', function() {
		test.string = 'hi';
		vValidate(test, function(err) {
			expect(err).toBeFalsy();
		});
	});

	it('should reject an invalid string', function() {
		test.string = 'tooo looong';
		vValidate(test, function(err) {
			expect(err).toBeTruthy();
		});
	});

	it('should accept a valid array', function() {
		test.array = [1,2];
		vValidate(test, function(err) {
			expect(err).toBeFalsy();
		});
	});

	it('should reject an invalid array', function() {
		test.array = 'im a string lol';
		vValidate(test, function(err) {
			expect(err).toBeTruthy();
		});
	});




	describe('arrayOfObjects', function() {

		it('should accept a valid ObjectId', function() {
			test.arrayOfObjects = [{objectId: new Schema.Types.ObjectId()}];
			vValidate(test, function(err) {
				expect(err).toBeFalsy();
			});
		});

		it('should return an error if an invalid ObjectId is used', function() {
			test.arrayOfObjects = [{objectId: 'hi dere'}];
			vValidate(test, function(err) {
				expect(err).toBeTruthy();
			});
		});

		it('should accept a valid number', function() {
			test.arrayOfObjects = [{number: 10}];
			vValidate(test, function(err) {
				expect(err).toBeFalsy();
			});
		});

		it('should reject an invalid number', function() {
			test.arrayOfObjects = [{number: 'not a number'}];
			vValidate(test, function(err) {
				expect(err).toBeTruthy();
			});
		});

		it('should accept a valid string', function() {
			test.arrayOfObjects = [{string: 'hi'}];
			vValidate(test, function(err) {
				expect(err).toBeFalsy();
			});
		});

		it('should reject an invalid string', function() {
			test.arrayOfObjects = [{string: 'toooo loooong'}];
			vValidate(test, function(err) {
				expect(err).toBeTruthy();
			});
		});

		it('should accept a valid array', function() {
			test.arrayOfObjects = [{array: [1,2]}];;
			vValidate(test, function(err) {
				expect(err).toBeFalsy();
			});
		});

		it('should reject an invalid array', function() {
			test.arrayOfObjects = [{array: ['too', 'many', 'elements']}];
			vValidate(test, function(err) {
				expect(err).toBeTruthy();
			});
		});
	});
});