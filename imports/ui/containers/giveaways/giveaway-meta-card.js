import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayMetaCard } from '../../components/giveaways/giveaway-meta-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { GiveawayComments } from '../../../api/giveaway-comments/giveaway-comments';

import * as GiveawaysHelper from '../../../util/giveaways';

let cachedPageViews = new ReactiveVar( 0 );
let cachedClicks = new ReactiveVar( 0 );
let cacheId = null;

const composer = (props, onData) => {
  if (Meteor.subscribe('giveaway-by-id', props.gaId).ready()) {
    const ga = Giveaways.findOne(props.gaId);

    if (ga && Meteor.subscribe('user-by-id', ga.userId).ready()) {
      const user = Meteor.users.findOne({ _id: ga.userId });

      if (user && Meteor.subscribe('giveaways-by-user', ga.userId).ready()) {
        const shareCount = Giveaways.find({ userId: ga.userId }).count();
        const ratingPercent = GiveawaysHelper.getRatingPercentageForUser(user);

        if (ga.userId != Meteor.userId()) {
          onData(null, { ga, user, shareCount, ratingPercent, commentCount: 0, pageViews: 0 });
        } else {
          if (Meteor.subscribe('comments-for-giveaway', props.gaId).ready()) {
            const commentCount = GiveawayComments.find({ giveawayId: props.gaId, isRemoved: { $ne: true } }).count();

            if (cacheId != props.gaId) {
              Meteor.call('giveaways.getPageviews', props.gaId, function (error, pageViews) {
                if (error)
                  pageViews = 0;

                cachedPageViews.set(pageViews);

                Meteor.call('giveaways.getInfoboxOpens', props.gaId, function (error, infoboxOpens) {
                  if (error)
                    infoboxOpens = pageViews;

                  cacheId = props.gaId;
                  cachedClicks.set(infoboxOpens + pageViews);
                });
              });
            }

            onData(null, { ga, user, shareCount, ratingPercent, commentCount, pageViews: cachedPageViews.get(), clicks: cachedClicks.get() });
          }
        }

      }
    }
  }
};

export default composeWithTracker(composer, Loading)(GiveawayMetaCard);
