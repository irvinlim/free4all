import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayInfoboxContent } from '../../components/giveaways/giveaway-infobox-content';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { Categories } from '../../../api/categories/categories';
import { StatusTypes } from '../../../api/status-types/status-types';

const composer = (props, onData) => {
  let giveaway, latestStatus, latestStatusType, category, parentCategory;

  if (!props.gaId) {
    onData(null, {});

  } else if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {

    giveaway = Giveaways.findOne(props.gaId);

    onData(null, { giveaway });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayInfoboxContent);
