import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { CommunityGiveaways } from '../../components/giveaways/community-giveaways';
import { Loading } from '../../components/loading';
import { Giveaways } from '../../../api/giveaways/giveaways';
import { Communities } from '../../../api/communities/communities';
import * as LatLngHelper from '../../../util/latlng';

const composer = (props, onData) => {
  if(Meteor.subscribe('userIds-by-commId', props.communityId).ready()){
    const users = Meteor.users.find({ communityIds: props.communityId}).fetch();
    const userIds = users.map(user => user._id);
    const community = Communities.findOne(props.communityId);
    let giveaways = [];

    if(!props.user)
      props.user = null;

    if(Meteor.subscribe('users-giveaways-within-date', 
      props.userFromDate, props.userUntilDate, props.isAllGa, userIds).ready()){
      const findParams = {
        startDateTime:  { $gte: props.userFromDate },
        endDateTime:    {  $lt: props.userUntilDate },
        userId:         {  $in: userIds }
      };
      if(props.isAllGa)
        giveaways = Giveaways.find({ userId: { $in: userIds } })
      else
        giveaways = Giveaways.find(findParams);

      onData(null, {
        community: community,
        giveaways: giveaways,
        nearbyOnClick: props.nearbyOnClick,
        user: props.user,
      });
    } else {
      onData(null, {
        community: community,
        giveaways: giveaways,
        nearbyOnClick: props.nearbyOnClick,
        user: props.user,
      });
    }
  }
};
export default composeWithTracker(composer, Loading)(CommunityGiveaways);