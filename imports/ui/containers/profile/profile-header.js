import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { ProfileHeader } from '../../components/profile/profile-header';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { Communities } from '../../../api/communities/communities';

import * as GiveawaysHelper from '../../../util/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('user-by-id', props.userId).ready()) {
    const user = Meteor.users.findOne(props.userId);

    if (Meteor.subscribe('giveaways-by-user', props.userId).ready()) {
      const shareCount = Giveaways.find({ userId: props.userId }).count();
      const ratingPercent = GiveawaysHelper.getRatingPercentageForUser(user);

      if (user.communityIds || user.homeCommunityId) {
        const communityIdsUnion = _.union(user.communityIds, [ user.homeCommunityId ]);

        if (Meteor.subscribe('communities-by-id', communityIdsUnion).ready()) {
          const homeCommunity = Communities.findOne(user.homeCommunityId);
          const userCommunities = Communities.find({ _id: { $in: user.communityIds } }).fetch().filter(comm => comm._id !== user.homeCommunityId);

          onData(null, { user, shareCount, ratingPercent, userCommunities, homeCommunity });
        }
      } else {
        onData(null, { user, shareCount, ratingPercent });
      }
    }
  }
};

export default composeWithTracker(composer, Loading)(ProfileHeader);
