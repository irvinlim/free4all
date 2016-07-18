import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { CommunityGiveaways } from '../../components/giveaways/community-giveaways';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';

import * as LatLngHelper from '../../../util/latlng';

const composer = (props, onData) => {

    if(Meteor.subscribe('userIds-by-commId', props.communityId).ready()){

      const userIds = Meteor.users.find({
        communityIds: props.communityId
      }).fetch().map(user => user._id);

      if(userIds.length>0 && Meteor.subscribe('users-giveaways-within-date', 
        props.userFromDate, props.userUntilDate, props.isAllGa, userIds).ready()){

        let giveaways = [];
        const findParams = {
          startDateTime:  { $gte: props.userFromDate },
          endDateTime:    {  $lt: props.userUntilDate },
          userId:         {  $in: userIds }
        };

        if(props.isAllGa)
          giveaways = Giveaways.find({ userId: {$in: userIds}})
        else
          giveaways = Giveaways.find(findParams);

        onData(null, {
          giveaways: giveaways,
          nearbyOnClick: props.nearbyOnClick,
        });
      }
    }
};

export default composeWithTracker(composer, Loading)(CommunityGiveaways);
