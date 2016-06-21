import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayInfoboxContent } from '../../components/giveaways/giveaway-infobox-content';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { Categories } from '../../../api/categories/categories';
import { StatusTypes } from '../../../api/status-types/status-types';
import { StatusUpdates } from '../../../api/status-updates/status-updates';

const composer = (props, onData) => {
  let giveaway, latestStatus, latestStatusType, category, parentCategory;

  if (!props.gaId) {
    onData(null, {});

  } else if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {

    giveaway = Giveaways.findOne(props.gaId);

    if (giveaway) {
      console.log(giveaway)
      latestStatus = StatusUpdates.findOne({ userId: giveaway.userId, giveawayId: giveaway._id }, { sort: { date: "desc" } });
      latestStatusType = StatusTypes.findOne(latestStatus.statusTypeId);
      category = Categories.findOne(giveaway.categoryId);
      parentCategory = ParentCategories.findOne(category.parent);
    }

    onData(null, { giveaway, latestStatus, latestStatusType, category, parentCategory });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayInfoboxContent);
