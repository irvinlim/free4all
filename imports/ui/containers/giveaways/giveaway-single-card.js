import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawaySingleCard } from '../../components/giveaways/giveaway-single-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    onData(null, {
      ga: Giveaways.findOne(props.gaId),
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawaySingleCard);
