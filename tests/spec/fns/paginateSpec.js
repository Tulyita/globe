'use strict';

var paginate = require('../../../server/fns/paginate');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');


var testSchema = new mongoose.Schema({
	string: String,
	number: Number
});
var Test = mongoose.model('PaginateSpecTest', testSchema);


describe('paginate', function() {

	beforeEach(function(done) {
		Test.create({string: 'aaa', number: 1}, function(err1) {
			Test.create({string: 'bbb', number: 2}, function(err2) {
				Test.create({string: 'ccc', number: 3}, function(err3) {
					return done(err1 || err2 || err3);
				});
			});
		});
	});

	afterEach(function(done) {
		Test.collection.remove({}, done);
	});


	describe('page', function() {

		it('should skip the content on the correct page', function(done) {
			paginate({model: Test, page: 2, count: 2}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].string).toBe('ccc');
				done();
			});
		});

		it('should return the current page in the result', function(done) {
			paginate({model: Test, page: 7}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.page).toBe(7);
				done();
			});
		});

		it('should not allow a page less than minPage', function(done) {
			paginate({model: Test, page: 4, minPage: 9}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.page).toBe(9);
				done();
			});
		});

		it('should not allow a page greater than maxPage', function(done) {
			paginate({model: Test, page: 7, maxPage: 4}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.page).toBe(4);
				done();
			});
		});

		it('minPage should default to 1', function(done) {
			paginate({model: Test, page: -2}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.page).toBe(1);
				done();
			});
		});

		it('maxPage should default to 50', function(done) {
			paginate({model: Test, page: 999}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.page).toBe(50);
				done();
			});
		});
	});


	describe('count', function() {

		it('should return count items per page', function(done) {
			paginate({model: Test, count: 2}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results.length).toBe(2);
				done();
			});
		});
	});


	describe('pageCount', function() {

		it('should return total number of pages that exist', function(done) {
			paginate({model: Test, count: 1}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.pageCount).toBe(3);
				done();
			});
		});
	});


	describe('sort', function() {

		it('should sort using provided object', function(done) {
			paginate({model: Test, sort: {number: 1}, allowSortBy: ['number']}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].number).toBe(1);

				paginate({model: Test, sort: {number: -1}, allowSortBy: ['number']}, function(err, result) {
					if(err) {
						return done(err);
					}
					expect(result.results[0].number).toBe(3);
					done();
				});
			});
		});

		it('should sort using provided json string', function(done) {
			paginate({model: Test, sort: '{"number": -1}', allowSortBy: ['number']}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].number).toBe(3);
				done();
			});
		});

		it('should not sort if fields are not present in allowSortBy', function(done) {
			paginate({model: Test, sort: {number: -1}, allowSortBy: []}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].number).toBe(1);
				done();
			});
		});
	});


	describe('find', function() {

		it('should query for items that match', function(done) {
			paginate({model: Test, find: {string: 'bbb'}, allowFindBy: ['string']}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].string).toBe('bbb');
				done();
			});
		});

		it('should accept json string', function(done) {
			paginate({model: Test, find: '{"string": "bbb"}', allowFindBy: ['string']}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].string).toBe('bbb');
				done();
			});
		});

		it('should ignore values not present in allowFindBy', function(done) {
			paginate({model: Test, find: {string: 'bbb'}}, function(err, result) {
				if(err) {
					return done(err);
				}
				expect(result.results[0].string).toBe('aaa');
				done();
			});
		});
	});
});