import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { TimelineItems } from '../../components/timeline/timeline-items';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaways-search', props).ready()) {
    const now = new Date();
    const nextWeek = moment(now).add(1, 'week').toDate();

    const selector = {};
    const options = {};

    if (props.tab == "all-time" || props.sort == "highest-rated") {

      // Get IDs for k-highest rated giveaways
      const netRatingOptions = _.extend(options, { sort: { value: -1 } });
      Meteor.call('giveaways.getNetRatingIDs', netRatingOptions, function(error, ids) {

        // Fetch giveaways first, not sorted
        const giveaways = Giveaways.find({}, options).fetch();

        // Assign giveaways to a hashmap
        const giveawayHashMap = {};
        giveaways.forEach(ga => giveawayHashMap[ga._id] = ga);

        // Finally, get items in sorted order
        const sortedGiveaways = ids.map(id => giveawayHashMap[id]);

        // Remove undefined elements
        const filteredGiveaways = sortedGiveaways.filter(ga => !!ga);

        onData(null, {
          giveaways: filteredGiveaways,
          props: props,
        });
      });

    } else {

      switch (props.tab) {
        case "current":
          selector.startDateTime = { $lte: nextWeek };  // Must be ongoing/starting in the next 7 days
          selector.endDateTime = { $gt:  now };         // Must not be over
          options.sort = { startDateTime: -1 };         // Sort by newest first
          break;
        case "past":
          selector.endDateTime = { $lt:  now };         // Must be over
          options.sort = { endDateTime: -1 };           // Sort by most recently ended first
          break;
        default: // Searching
          if (props.searchQuery && props.sort == "most-relevant")
            options.sort = { score: { $meta: 'textScore' } };
          else if (props.sort == "newest-first")
            options.sort = { startDateTime: -1 };
          else if (props.sort == "oldest-first")
            options.sort = { startDateTime: 1 };
          break;
      }

      onData(null, {
        giveaways: Giveaways.find(selector, options).fetch(),
        props: props,
      });

    }
  } else {
    onData(null, {
      giveaways: [],
      props: props
    });
  }
};

export default composeWithTracker(composer, Loading)(TimelineItems);
