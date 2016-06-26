import { Meteor } from 'meteor/meteor';
import { Giveaways, GiveawayNetRatings } from '../giveaways';
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

  if (props.tab == "all-time") {

    // NOTE: Monitor if MapReduce runs unnecessarily slowly, if so move it to a cron job or something.

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

    // Return Giveaways (not sorted)
    return Giveaways.find(selector, options);

  } else {

    switch (props.tab) {

      case "current":
        selector.startDateTime = { $lte: tomorrow };  // Must be ongoing/starting in the next 24 hours
        selector.endDateTime = { $gt:  now };         // Must not be over
        options.sort = { startDateTime: -1 };         // Sort by newest first
        break;

      case "past":
        selector.endDateTime = { $lt:  now };         // Must be over
        options.sort = { endDateTime: -1 };           // Sort by most recently ended first
        break;

      default: // Searching
        // If no search query or category ID, show no results.
        if (!props.parentCategoryId && !props.categoryId && !props.searchQuery.length)
          return Giveaways.find(null);

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

        // Sort according to props.sort
        // options.sort = {  };

        break;
    }

    return Giveaways.find(selector, options);
  }
});
