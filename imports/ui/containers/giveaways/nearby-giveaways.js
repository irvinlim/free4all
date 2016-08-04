import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { NearbyGiveaways } from '../../components/giveaways/nearby-giveaways';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

import * as LatLngHelper from '../../../util/latlng';

const composer = (props, onData) => {
  const now = new Date();
  const nextWeek = moment(now).add(1, 'week').toDate();

  // Show ongoing ones sorted by more recently started ones first
  // followed by upcoming ones sorted by starting soonest first

  const ongoingGiveaways = Giveaways.find({
    startDateTime:  { $lte: now },   // Start date must be earlier than now
    endDateTime:    { $gt:  now },   // End date must be later than now
  }, {
    sort: { startDateTime: -1 },     // Show more recently started ones first
  }).fetch();

  const upcomingGiveaways = Giveaways.find({
    startDateTime:  { $gt: now, $lte: nextWeek }, // Start date must be later than now, earlier than next week
    endDateTime:    { $gt:  now },                // End date must be later than now
  }, {
    sort: { startDateTime: 1 },   // Show starting soonest first
  }).fetch();

  onData(null, {
    giveaways: ongoingGiveaways.concat(upcomingGiveaways),
    nearbyOnClick: props.nearbyOnClick,
  });
};

export default composeWithTracker(composer, Loading)(NearbyGiveaways);
