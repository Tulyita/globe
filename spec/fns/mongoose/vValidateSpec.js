/* global describe, it, expect */

'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var Schema = mongoose.Schema;
var vValidate = require('../../../server/fns/mongoose/vValidate');
vValidate.attach(mongoose);


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
		string: {type: String, enum: ['1', '2']},
		array: [Number]
	}]
});

var Test = mongoose.model('vValidateTest', TestSchema);


describe('vValidate', function() {

	/*it('should attach vValidate to all documents function', function() {
		expect(Test.vValidate).toBeTruthy();
	});

	it('should accept a valid ObjectId', function(done) {
		Test.vValidate({objectId: new mongoose.Types.ObjectId()}, function(err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it('should return an error if an invalid ObjectId is used', function(done) {
		Test.vValidate({objectId: 123}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});

	it('should accept a valid number', function(done) {
		Test.vValidate({number: 11}, function(err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it('should reject an invalid number', function(done) {
		Test.vValidate({number: 'hello'}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});

	it('should accept a valid string', function(done) {
		Test.vValidate({string: 'hi'}, function(err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it('should reject an invalid string', function(done) {
		Test.vValidate({string: 'tooo looong'}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});

	it('should accept a valid array', function(done) {
		Test.vValidate({array: [1,2]}, function(err) {
			expect(err).toBeFalsy();
			done();
		});
	});

	it('should reject an invalid array', function(done) {
		Test.vValidate({array: [1,2,3,4]}, function(err) {
			expect(err).toBeTruthy();
			done();
		});
	});*/




	describe('arrayOfObjects', function() {

		it('should accept a valid ObjectId', function(done) {
			Test.vValidate({arrayOfObjects: [{objectId: new mongoose.Types.ObjectId()}]}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should return an error if an invalid ObjectId is used', function(done) {
			Test.vValidate({arrayOfObjects: [{objectId: 'hi dere'}]}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});

		it('should accept a valid number', function(done) {
			Test.vValidate({arrayOfObjects: [{number: 10}]}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should reject an invalid number', function(done) {
			Test.vValidate({arrayOfObjects: [{number: 'not a number'}]}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});

		it('should accept a valid string', function(done) {
			Test.vValidate({arrayOfObjects: [{string: '1'}]}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should reject an invalid string', function(done) {
			Test.vValidate({arrayOfObjects: [{string: 'invalid string'}]}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});

		it('should accept a valid array', function(done) {
			Test.vValidate({arrayOfObjects: [{array: [1,2]}]}, function(err) {
				expect(err).toBeFalsy();
				done();
			});
		});

		it('should reject an invalid array', function(done) {
			Test.vValidate({arrayOfObjects: [{array: ['not','numbers']}]}, function(err) {
				expect(err).toBeTruthy();
				done();
			});
		});
	});
});