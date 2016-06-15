import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { NearbyGiveaways } from '../../components/giveaways/nearby-giveaways';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import * as Helper from '../../../modules/helper';

const composer = (props, onData) => {
  const giveaways = Giveaways.find({}, {
    sort: { startDateTime: -1 }, // Show more recent ones first
    limit: 10,
  });

  onData(null, {
    giveaways: giveaways,
    nearbyOnClick: props.nearbyOnClick,
  });
};

export default composeWithTracker(composer, Loading)(NearbyGiveaways);
