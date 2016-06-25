import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../giveaways';
import { Categories } from '../../categories/categories';

Meteor.publish('giveaway-by-id', function(gaId) {
  check(gaId, Match._id);
  return Giveaways.find(gaId);
});

Meteor.publish('giveaways-on-screen', function(date, mapBounds) {
  check(date, Date);
  check(mapBounds, Array);

  const tomorrow = moment(date).add(1, 'd').toDate();
  const findParams = {
    coordinates : {
      $geoWithin : { $box : mapBounds }
    },
    startDateTime:  { $lte: tomorrow, },    // Must be ongoing/starting in the next 24 hours
    endDateTime:    { $gt:  date, },        // Must not be over
    deleted:        { $ne:  true },         // Must not be deleted (local deletion)
  };

  return Giveaways.find(findParams);
});

Meteor.publish('giveaways-search', function(props) {
  check(props, Object);

  const { tab, offset, perPage, searchQuery, categoryId } = props;
  const now = new Date();
  const tomorrow = moment(now).add(1, 'd').toDate();

  const selector = {
    deleted: { $ne:  true },  // Must not be deleted (local deletion)
  };

  const options = {
    skip: props.offset,
    limit: props.perPage,
  };

  // Aggregate ratings
  // ...

  switch (props.tab) {
    case "all-time":
      // options.sort = {  };                       // Sort by highest ratings first
      break;
    case "past":
      selector.endDateTime = { $lt:  now };         // Must be over
      options.sort = { endDateTime: -1 };           // Sort by most recently ended first
      break;
    default: // Show current
      selector.startDateTime = { $lte: tomorrow };  // Must be ongoing/starting in the next 24 hours
      selector.endDateTime = { $gt:  now };         // Must not be over
      options.sort = { startDateTime: -1 };         // Sort by newest first
      break;
  }

  // Categorisation: Either specific category or all categories in specific parent
  if (props.parentCategoryId)
    selector.categoryId = { $in: Categories.find({ parent: props.parentCategoryId }).map(cat => cat._id) };
  else if (props.categoryId)
    selector.categoryId = categoryId;

  // Full-text search
  if (props.searchQuery.length)
    selector.$text = {
      search: props.searchQuery,
    };

  return Giveaways.find(selector, options);
});
