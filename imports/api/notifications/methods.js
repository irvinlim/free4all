import { Giveaways } from '../giveaways/giveaways';

import { aggregateUserNames } from '../../util/notifications';

if (Meteor.isServer) {
  Meteor.methods({

    // notifGroupId is a unique ID that can group pushed notifications together
    // callback has to return an object: { title, body, avatar: { type, val }, url, metadata }
    upsertNotifications: (notifGroupId, userId, callback) => {
      check(notifGroupId, String);
      check(userId, Match._id);
      check(callback, Function);

      const existingData = Herald.collection.findOne({ userId, 'data.notifGroupId': notifGroupId });
      const newData = callback(existingData);

      // Remove existing notification
      Herald.collection.remove({ userId, 'data.notifGroupId': notifGroupId });

      // Replace with new notification
      Herald.createNotification(userId, {
        courier: 'notification',
        data: {
          ...newData,
          notifGroupId,
          timestamp: new Date(),
        }
      });
    },

    notifyCommentedOnGiveaway: (giveawayId, commenterId) => {
      check(giveawayId, Match._id);
      check(commenterId, Match._id);

      const giveaway = Giveaways.findOne({ _id: giveawayId });

      if (!giveaway)
        return;

      Meteor.call('upsertNotifications', giveawayId, giveaway.userId, (existingData) => {
        const metadata = existingData ? existingData.metadata : null;
        const newUserIds = metadata ? metadata.userIds.filter(userId => userId !== commenterId) : [];
        newUserIds.unshift(commenterId);
        const newUserNames = aggregateUserNames(newUserIds);

        return {
          title: `New comment on your giveaway`,
          body: `${newUserNames} commented on ${giveaway.title}.`,
          avatar: {
            type: 'giveaway',
            val: giveawayId
          },
          url: `/giveaway/${giveawayId}`,
          metadata: {
            userIds: newUserIds
          },
        };
      }, (error, result) => {

      });
    },

  });
}
