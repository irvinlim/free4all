import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayStatusUpdatesCard } from '../../components/giveaways/giveaway-status-updates-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { StatusTypes } from '../../../api/status-types/status-types';

import * as GiveawaysHelper from '../../../util/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const ga = Giveaways.findOne(props.gaId);
    const sortedStatusUpdates = GiveawaysHelper.getSortedStatusUpdates(ga);
    const denormalized = sortedStatusUpdates.map(su => {
      return {
        user: Meteor.users.findOne(su.userId),
        statusType: StatusTypes.findOne(su.statusTypeId),
        date: su.date
      };
    });

    onData(null, {
      statusUpdates: denormalized,
      owner: Meteor.users.findOne(ga.userId)
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayStatusUpdatesCard);
