import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawaySharingCard } from '../../components/giveaways/giveaway-sharing-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const ga = Giveaways.findOne(props.gaId);
    onData(null, { ga });
  }
};

export default composeWithTracker(composer, Loading)(GiveawaySharingCard);
