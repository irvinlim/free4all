import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { ProfileHeader } from '../../components/profile/profile-header';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { Communities } from '../../../api/communities/communities';

const composer = (props, onData) => {
  if (Meteor.subscribe('user-by-id', props.userId).ready()) {
    const user = Meteor.users.findOne(props.userId);
    if (Meteor.subscribe('giveaways-by-user', props.userId).ready()) {
      const shareCount = Giveaways.find({ userId: props.userId }).count();
      if (user.homeCommunityId) {
        if (Meteor.subscribe('community-by-id', user.homeCommunityId).ready()) {
          const homeCommunity = Communities.findOne(user.homeCommunityId);
          onData(null, { user, shareCount, homeCommunity });
        }
      } else {
        onData(null, { user, shareCount });
      }
    }
  }
};

export default composeWithTracker(composer, Loading)(ProfileHeader);
