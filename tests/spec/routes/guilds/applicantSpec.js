'use strict';

var mongoose = require('mongoose');
var mockgoose = require('mockgoose');
mockgoose(mongoose);

var applicant = require('../../../../server/routes/guilds/applicant');
var Guild = require('../../../../server/models/guild');
var User = require('../../../../server/models/user');

describe('routes/guilds/applicant', function() {

	var userId, guild;

	beforeEach(function(done) {
		userId = mongoose.Types.ObjectId();
		Guild.create({_id: 'racers'}, function(err, _guild_) {
			guild = _guild_;
			User.create({_id: userId, name: 'aaaa', site: 'j', group: 'u', siteUserId: '123'}, function(err2) {
				done(err || err2);
			});
		});
	});

	afterEach(function() {
		mockgoose.reset();
	});

	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	describe('put', function() {

		it('should put applicant', function(done) {
			var req = {
				session: {
					_id: userId
				},
				params: {
					guildId: 'racer',
					userId: userId
				},
				guild: guild
			};
			applicant.put(req, {apiOut: function(err, res) {
				expect(res._id).toEqual(userId);
				expect(guild.applicants[0]._id).toEqual(userId);
				done(err);
			}});
		});
	});


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	/*describe('post', function() {

		it('should call guild.removeJoinRequest, then guild.addMember', function() {
			var guild = {
				removeJoinRequest: sinon.stub().yields(null),
				addMember: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.acceptJoinRequest(guild, data, session, callback);
			expect(guild.removeJoinRequest.args[0][0]).toEqual({_id: '2'});
			expect(guild.addMember.args[0]).toEqual(['2', callback]);
		});

		it('should yield an error if guild.removeJoinRequest yields an error', function() {
			var guild = {
				removeJoinRequest: sinon.stub().yields('an error'),
				addMember: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.acceptJoinRequest(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['an error']);
		});

		it('should yield an error if you are not the owner', function() {
			var guild = {
				removeJoinRequest: sinon.stub().returns('an error'),
				addMember: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(false)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.acceptJoinRequest(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});*/


	//////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////

	/*describe('del', function() {

		it('should forward request to Guild', function() {
			var guild = {
				removeJoinRequest: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(true)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.removeJoinRequest(guild, data, session, callback);
			expect(guild.removeJoinRequest.args[0]).toEqual([{_id: '2'}, callback]);
		});

		it('should yield false if you are not an owner', function() {
			var guild = {
				removeJoinRequest: sinon.stub(),
				isOwner: sinon.stub().withArgs('1').returns(false)
			};
			var data = {userId: '2'};
			var session = {_id: '1'};
			var callback = sinon.stub();
			guildRoutes.removeJoinRequest(guild, data, session, callback);
			expect(callback.args[0]).toEqual(['You are not an owner of this guild.']);
		});
	});*/
});