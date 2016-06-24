import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { NearbyGiveaways } from '../../components/giveaways/nearby-giveaways';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

import * as LatLngHelper from '../../../util/latlng';

const composer = (props, onData) => {
  setTimeout(function() {
    const giveaways = Giveaways.find({}, {
      sort: { startDateTime: -1 }, // Show more recent ones first
      limit: 10,
    });

    onData(null, {
      giveaways: giveaways,
      nearbyOnClick: props.nearbyOnClick,
    });
  }, 500);
};

export default composeWithTracker(composer, Loading)(NearbyGiveaways);
