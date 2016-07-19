import { Meteor } from 'meteor/meteor';
import { Communities } from '../communities';

Meteor.publish('all-communities', () => Communities.find());

Meteor.publish('community-by-id', function(communityId) {
  check(communityId, Match._id);
  return Communities.find(communityId);
});

Meteor.publish('communities-search', function(props) {
  check(props, Object);
  
  const selector = {}
  const options = { fields: {} };

  if (props.sort == "largest-first")
  	_.extend(options.fields, { sort: { count: -1 } });
  else if (props.sort == "smallest-first")
  	_.extend(options.fields, { sort: { count: 1 } });

  // Full-text search
  if (props.searchQuery) {
    selector.$text = { $search: props.searchQuery };
    options.fields = _.extend(options.fields, { score: { $meta: 'textScore' } });
  }


  return Communities.find(selector, options);
});
