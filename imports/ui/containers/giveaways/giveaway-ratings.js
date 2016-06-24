import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayRatings } from '../../components/giveaways/giveaway-ratings';
import { Loading } from '../../components/loading';
import { Giveaways } from '../../../api/giveaways/giveaways';

import * as GiveawaysHelper from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (!props.gaId)
    return;

  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const giveaway = Giveaways.findOne(props.gaId);

    if (!giveaway)
      return;

    onData(null, { giveaway });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayRatings);
