import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { TimelineItems } from '../../components/timeline/timeline-items';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaways-search', props).ready()) {

    const options = {};

    if (props.tab == "all-time") {

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

        onData(null, {
          giveaways: sortedGiveaways,
          props: props,
        });
      });

    } else {

      switch (props.tab) {
        case "current":
          options.sort = { startDateTime: -1 }; // Sort by newest first
          break;
        case "past":
          options.sort = { endDateTime: -1 };   // Sort by most recently ended first
          break;
        default: // Searching
          if (props.sort == "most-relevant")
            options.sort = { score: { $meta: 'textScore' } };
          else if (props.sort == "newest-first")
            options.sort = { startDateTime: -1 };
          else if (props.sort == "oldest-first")
            options.sort = { endDateTime: -1 };
          break;
      }

      onData(null, {
        giveaways: Giveaways.find({}, options).fetch(),
        props: props,
      });

    }
  }
};

export default composeWithTracker(composer, Loading)(TimelineItems);
