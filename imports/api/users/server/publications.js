import { Meteor } from 'meteor/meteor';
import { modsOrAdmins } from '../../../util/roles';

const userPublicFields = {
  profile: true,
  roles: true,
  emails: true,
  'services.facebook.id': true,
  'services.google.picture': true,
  communityIds: true,
};

// For current user only
Meteor.publish('user-data', function() {
  return Meteor.users.find(this.userId);
});

// For public
Meteor.publish('user-by-id', function(userId) {
  check(userId, Match._id);
  return Meteor.users.find(userId, {
    fields: userPublicFields,
  });
});

// For public
Meteor.publish('users-by-id', function(userIds) {
  check(userIds, Array);
  return Meteor.users.find({
    _id: { $in: userIds }
  }, {
    fields: userPublicFields,
  });
});

// For public
Meteor.publish('userIds-by-commId', function(commId) {
  check(commId, Match._id);
  return Meteor.users.find({ communityIds: commId }, { _id: true, fields: userPublicFields });
});

// For mods/admins only
Meteor.publish('user-search', function(props) {
  check(props, Object);

  // Don't let non-admins search
  if (!modsOrAdmins(this.userId))
    return null;

  const { searchQuery, role } = props;
  const selector = {};
  const options = {
    fields: {}
  };

  // Filter by Role
  if (role != 'all-roles') {
    if (role === 'no-role')
      selector.roles = { $size: 0 };
    else
      selector.roles = props.role;
  }

  // Full-text search
  if (searchQuery) {
    selector.$text = { $search: searchQuery };
    options.fields = _.extend(options.fields, { score: { $meta: 'textScore' } });
  }

  return Meteor.users.find(selector, options);
});
