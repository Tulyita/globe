var sinon = require('sinon');
var mongoose = require('mongoose');
var User = require('../../server/models/user');
var friends = require('../../server/routes/friends');

describe('friends', function() {

	//////////////////////////////////////////
	////////////////////////////////////////
	//////////////////////////////////////

	describe('get', function() {

		beforeEach(function() {
			sinon.stub(User, 'findById')
				.withArgs('1').yields(null, {friends: ['friend1', 'friend2']})
				.withArgs('2').yields(null, null)
				.withArgs('bomb').yields('mongo error');
		});

		afterEach(function() {
			User.findById.restore();
		});

		it('should yield a list of your friends', function() {
			var req = {
				body: {},
				session: {_id: '1'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.get(req, res);
			expect(res.apiOut.args[0]).toEqual([null, ['friend1', 'friend2']]);
		});

		it('should yield an error if the specified account does not exist', function() {
			var req = {
				body: {},
				session: {_id: '2'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.get(req, res);
			expect(res.apiOut.args[0]).toEqual(['User "2" not found.']);
		});

		it('should yield an error if User.findById yields an error', function() {
			var req = {
				body: {},
				session: {_id: 'bomb'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.get(req, res);
			expect(res.apiOut.args[0]).toEqual(['mongo error']);
		});
	});


	//////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////

	describe('post', function() {

		beforeEach(function() {
			sinon.stub(friends, 'addFriend');
		});

		afterEach(function() {
			friends.addFriend.restore();
		});

		it('should forward request to action function', function() {
			var req = {
				body: {action: 'add'},
				session: {_id: '1'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.post(req, res);
			expect(friends.addFriend.args[0]).toEqual([req, res]);
		});

		it('should yield an error if action is not found', function() {
			var req = {
				body: {action: 'not-an-action'},
				session: {_id: '1'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.post(req, res);
			expect(res.apiOut.args[0]).toEqual(['Action "not-an-action" not found.']);
		});
	});


	/////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////

	describe('addFriend', function() {

		beforeEach(function() {
			sinon.stub(User, 'findById')
				.withArgs('1', {friends: 1}).yields(null, {friends: [], save: sinon.stub().yields(null)})
				.withArgs('2', {_id: 1, name: 1, site: 1, group: 1}).yields(null, {_id: '2', name: 'phil', site: 'j', group: 'u'})
				.withArgs('3').yields(null, null)
				.withArgs('bomb').yields('mongo error');
		});

		afterEach(function() {
			User.findById.restore();
		});

		it('should add a user to your friends list and return it', function() {
			var req = {
				body: {action: 'add', userId: '2'},
				session: {_id: '1'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.addFriend(req, res);
			expect(User.findById.callCount).toBe(2);
			expect(res.apiOut.args[0]).toEqual([null, [{_id: '2', name: 'phil', site: 'j', group: 'u'}]]);
		});

		it('should yield an error if the user is not found', function() {
			var req = {
				body: {action: 'add', userId: '3'},
				session: {_id: '1'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.addFriend(req, res);
			expect(User.findById.callCount).toBe(2);
			expect(res.apiOut.args[0]).toEqual(['Could not find account "3".']);
		});

		it('should yield an error if your account is not found', function() {
			User.findById.withArgs('99').yields(null, null);
			var req = {
				body: {action: 'add', userId: '2'},
				session: {_id: '99'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.addFriend(req, res);
			expect(User.findById.callCount).toBe(1);
			expect(res.apiOut.args[0]).toEqual(['Could not find your account with id "99".']);
		});
	});


	/////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////

	describe('removeFriend', function() {

		beforeEach(function() {
			sinon.stub(User, 'findById')
				.withArgs('1', {friends: 1}).yields(null, {
					friends: [{
						_id: '3',
						name: 'sally',
						site: 'j',
						group: 'u'
					}],
					save: sinon.stub().yields(null)
				})
				.withArgs('2').yields(null, null)
				.withArgs('bomb').yields('mongo error');
		});

		afterEach(function() {
			User.findById.restore();
		});

		it('should remove a friend from your account', function() {
			var req = {
				body: {action: 'remove', userId: '3'},
				session: {_id: '1'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.removeFriend(req, res);
			expect(User.findById.callCount).toBe(1);
			expect(res.apiOut.args[0]).toEqual([null, []]);
		});

		it('should yield an error if your account is not found', function() {
			var req = {
				body: {action: 'remove', userId: '3'},
				session: {_id: '2'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.removeFriend(req, res);
			expect(User.findById.callCount).toBe(1);
			expect(res.apiOut.args[0]).toEqual(['Could not find your account with id "2".']);
		});

		it('should yield an error if User.findById yields an error', function() {
			var req = {
				body: {action: 'remove', userId: '3'},
				session: {_id: 'bomb'}
			};
			var res = {
				apiOut: sinon.stub()
			};
			friends.removeFriend(req, res);
			expect(User.findById.callCount).toBe(1);
			expect(res.apiOut.args[0]).toEqual(['mongo error']);
		});
	});
});