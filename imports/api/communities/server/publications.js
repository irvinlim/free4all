import { Meteor } from 'meteor/meteor';
import { Communities } from '../communities';

Meteor.publish('all-communities', () => Communities.find());

Meteor.publish('communityId-by-id', function(communityId) {
  check(communityId, Match._id);
  return Communities.find(communityId);
});
