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
    const latestOwnerUpdate = GiveawaysHelper.getLastOwnerStatus(ga);

    const denormalize = su => {
      return {
        user: Meteor.users.findOne(su.userId),
        statusType: StatusTypes.findOne(su.statusTypeId),
        date: su.date
      };
    };

    const denormalizedStatusUpdates = sortedStatusUpdates.map(denormalize);

    onData(null, {
      ga: ga,
      statusUpdates: denormalizedStatusUpdates,
      latestOwnerUpdate: denormalize(latestOwnerUpdate),
      owner: Meteor.users.findOne(ga.userId),
      statusTypes: StatusTypes.find({}, { sort: { relativeOrder: 1 } })
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayStatusUpdatesCard);
