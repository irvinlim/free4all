import { Meteor } from 'meteor/meteor';
import { Giveaways, GiveawayNetRatings } from '../giveaways';

import * as CategoriesHelper from '../../../util/categories';

Meteor.publish('giveaway-by-id', function(gaId) {
  check(gaId, Match._id);
  return Giveaways.find({
    _id: gaId,
    isRemoved: { $ne:  true },  // Must not be deleted (local deletion)
  });
});

Meteor.publish('giveaways-by-user', function(userId) {
  check(userId, Match._id);
  return Giveaways.find({
    userId: userId,
    isRemoved: { $ne:  true },  // Must not be deleted (local deletion)
  });
});

Meteor.publish('giveaways-by-users', function(userIds) {
  check(userIds, [Match._id]);
  return Giveaways.find({
    userId: {$in: userIds},
    isRemoved: { $ne:  true },  // Must not be deleted (local deletion)
  });
});

Meteor.publish('giveaways-on-screen', function(date, mapBounds) {
  check(date, Date);
  check(mapBounds, Array);

  const nextWeek = moment(date).add(1, 'week').toDate();
  const findParams = {
    coordinates : {
      $geoWithin : { $box : mapBounds }
    },
    startDateTime:  { $lte: nextWeek, },    // Must be ongoing/starting in the next 7 days
    endDateTime:    { $gt:  date, },        // Must not be over
    isRemoved:      { $ne:  true },         // Must not be deleted (local deletion)
  };

  return Giveaways.find(findParams);
});

Meteor.publish('user-giveaways-within-date', function(startDateRange, endDateRange, isAllGa){
  check(startDateRange, Date);
  check(endDateRange, Date);
  check(isAllGa, Boolean);

  const findParams = {
    startDateTime:  { $gte: startDateRange, },
    endDateTime:    { $lt:  endDateRange, },
    userId:         this.userId,
    isRemoved:      { $ne:  true },  // Must not be deleted (local deletion)
  };

  if(isAllGa)
    return Giveaways.find({
      userId:     this.userId,
      isRemoved: { $ne:  true }
    });
  else
    return Giveaways.find(findParams);
})

Meteor.publish('users-giveaways-within-date', function(startDateRange, endDateRange, isAllGa, commIdArr){
  check(startDateRange, Date);
  check(endDateRange, Date);
  check(isAllGa, Boolean);
  check(commIdArr, Array);

  const findParams = {
    startDateTime:  { $gte: startDateRange },
    endDateTime:    { $lt:  endDateRange },
    inclCommIds:    { $in: commIdArr },
    isRemoved:      { $ne:  true },  // Must not be deleted (local deletion)
  };

  if(isAllGa)
    return Giveaways.find({
      inclCommIds:  { $in: commIdArr},
      isRemoved:    { $ne:  true }
    })
  else
    return Giveaways.find(findParams);
})

Meteor.publish('giveaways-search', function(props) {
  check(props, Object);

  const { tab, offset, perPage, searchQuery, categoryId } = props;
  const now = new Date();
  const nextWeek = moment(now).add(1, 'week').toDate();

  const selector = {
    isRemoved: { $ne:  true },  // Must not be deleted (local deletion)
  };

  const options = {
    fields: {}
  };

  if (props.tab == "all-time" || props.sort == "highest-rated") {

    // MapReduce ratings
    Giveaways.mapReduce(function() {
      if (!this.ratings) {
        emit( this._id, 0);
      } else {
        emit( this._id, this.ratings.upvotes );
        emit( this._id, this.ratings.downvotes );
      }
    }, function(key, votes) {
      var upvotes = votes[0] ? votes[0].length : 0;
      var downvotes = votes[1] ? votes[1].length : 0;
      return upvotes - downvotes;
    }, { out: "GiveawayNetRatings" });

    // Fetch _id's
    const netRatingOptions = _.extend(options, { sort: { value: -1 } });
    const ids = GiveawayNetRatings.find({}, netRatingOptions).map(doc => doc._id);
    selector._id = { $in: ids };

  }

  switch (props.tab) {

    case "all-time":
      break;

    case "current":
      selector.startDateTime = { $lte: nextWeek };  // Must be ongoing/starting in the next 7 days
      selector.endDateTime = { $gt:  now };         // Must not be over
      break;

    case "past":
      selector.endDateTime = { $lt:  now };         // Must be over
      break;

    default: // Searching

      // Categorisation: Either specific category or all categories in specific parent
      if (props.categoryId && props.categoryId != 'all-categories') {
        const cat = CategoriesHelper.getMaybeCategory(props.categoryId);

        if (cat) {
          if (cat.parent)
            // Child category
            selector.categoryId = categoryId;
          else
            // Parent category
            selector.categoryId = { $in: CategoriesHelper.getOrderedChildCategoriesOf(cat).map(cat => cat._id) };
        }
      }

      // Full-text search
      if (props.searchQuery) {
        selector.$text = { $search: props.searchQuery };
        options.fields = _.extend(options.fields, { score: { $meta: 'textScore' } });
      }

      break;
  }

  return Giveaways.find(selector, options);
});
