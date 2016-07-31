import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { CommunityGiveaways } from '../../components/giveaways/community-giveaways';
import { Loading } from '../../components/loading';
import { Giveaways } from '../../../api/giveaways/giveaways';
import { Communities } from '../../../api/communities/communities';
import * as LatLngHelper from '../../../util/latlng';

const composer = (props, onData) => {

    const communityIdArr = [props.communityId];
    let giveaways = [];

    if(!props.user)
      props.user = null;

    if(Meteor.subscribe('users-giveaways-within-date',
      props.userFromDate, props.userUntilDate, props.isAllGa, communityIdArr).ready()){
      const findParams = {
        startDateTime:  { $gte: props.userFromDate },
        endDateTime:    {  $lt: props.userUntilDate },
        inclCommIds:    {  $in: communityIdArr }
      };
      if(props.isAllGa)
        giveaways = Giveaways.find({ inclCommIds: { $in: communityIdArr } })
      else
        giveaways = Giveaways.find(findParams);

      onData(null, {
        giveaways: giveaways,
        nearbyOnClick: props.nearbyOnClick,
        user: props.user,
      });
    } else {
      onData(null, {
        giveaways: giveaways,
        nearbyOnClick: props.nearbyOnClick,
        user: props.user,
      });
    }
};
export default composeWithTracker(composer, Loading)(CommunityGiveaways);
