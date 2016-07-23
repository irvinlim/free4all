import { Meteor } from 'meteor/meteor';

const userPublicFields = {
  profile: true,
  roles: true,
  emails: true,
  'services.facebook.id': true,
  'services.google.picture': true,
  homeLocation: true,
  homeCommunityId: true,
  communityIds: true
};

Meteor.publish('user-data', function() {
  return Meteor.users.find(this.userId, {
    fields: userPublicFields,
  });
});

Meteor.publish('user-by-id', function(userId) {
  check(userId, Match._id);
  return Meteor.users.find(userId, {
    fields: userPublicFields,
  });
});

Meteor.publish('users-by-id', function(userIds) {
  check(userIds, Array);
  return Meteor.users.find({
    _id: { $in: userIds }
  }, {
    fields: userPublicFields,
  });
});

Meteor.publish('userIds-by-commId', function(commId) {
  check(commId, Match._id);
  return Meteor.users.find({communityIds: commId}, {
    _id: true
  });
});
