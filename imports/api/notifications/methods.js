import { Giveaways } from '../giveaways/giveaways';
import { GiveawayComments } from '../giveaway-comments/giveaway-comments';

import { aggregateUserNames } from '../../util/notifications';
import { pluralizer } from '../../util/helper';
import * as RolesHelper from '../../util/roles';

const modsAdminsUserIds = () => RolesHelper.findModsOrAdmins().map(user => user._id);

if (Meteor.isServer) {

  const insertNotification = (userId, data) => {
    return Herald.createNotification(userId, {
      courier: 'notification',
      data: {
        ...data,
        timestamp: new Date(),
      }
    });
  };

  Meteor.methods({

    // notifGroupId is a unique ID that can group pushed notifications together
    // userIds is an array of users whom you wish to send the notification to
    // callback has to return an object: { title, body, avatar: { type, val }, url, metadata }
    upsertNotifications: (notifGroupId, userIds, callback) => {
      check(notifGroupId, String);
      check(userIds, Array);
      check(callback, Function);

      userIds.forEach((userId) => {

        // Find user
        const user = Meteor.users.findOne(userId);

        if (!user)
          return true;

        // Find existing unread notification to modify
        const existingData = Herald.collection.findOne({ userId, 'data.notifGroupId': notifGroupId, read: false });
        const newData = callback ? callback(existingData) : existingData;

        // Remove existing notification
        Herald.collection.remove({ userId, 'data.notifGroupId': notifGroupId, read: false });

        // Replace with new notification
        insertNotification(userId, { ...newData, notifGroupId });
      });
    },

    removeUnreadNotification: (notifGroupId, userIds) => {
      check(notifGroupId, String);
      check(userIds, Array);

      return Herald.collection.remove({ userId: { $in: userIds }, 'data.notifGroupId': notifGroupId, read: false });
    },

    // Giveaways

    notifyModsFlaggedGiveaway: (giveawayId, flaggerId) => {
      check(giveawayId, Match._id);
      check(flaggerId, Match._id);

      const giveaway = Giveaways.findOne(giveawayId);

      if (!giveaway)
        return;

      Meteor.call('upsertNotifications', `flaggedGiveaway-${giveawayId}`, modsAdminsUserIds(), (existingData) => {
        const metadata = existingData ? existingData.metadata : null;
        const newUserIds = metadata ? metadata.userIds.filter(userId => userId !== flaggerId) : [];
        newUserIds.unshift(flaggerId);
        const newUserNames = aggregateUserNames(newUserIds);

        return {
          title: `Giveaway requires review`,
          body: `${newUserNames} ${pluralizer(newUserIds.length, 'has', 'have')} flagged ${giveaway.title}.`,
          avatar: {
            type: 'icon',
            val: {
              icon: 'flag',
              color: '#d23726'
            }
          },
          url: `/giveaway/${giveawayId}`,
          metadata: {
            userIds: newUserIds
          },
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyModsFlaggedGiveaway:");
          console.log(error);
        }
      });
    },

    unnotifyModsFlaggedGiveaway: (giveawayId) => {
      check(giveawayId, Match._id);

      Meteor.call('removeUnreadNotification', `flaggedGiveaway-${giveawayId}`, modsAdminsUserIds(), (error, result) => {
        if (error) {
          console.log("Error removing notification in unnotifyModsFlaggedGiveaway:");
          console.log(error);
        }
      });
    },

    notifyRemovedFlaggedGiveaway: (giveawayId) => {
      check(giveawayId, Match._id);

      const giveaway = Giveaways.findOne(giveawayId);

      if (!giveaway)
        return;

      Meteor.call('upsertNotifications', `removedFlaggedGiveaway-${giveawayId}`, [ giveaway.userId ], (existingData) => {
        return {
          title: 'Giveaway removed',
          body: `Your giveaway ${giveaway.title} was reported and removed by our moderators.`,
          avatar: {
            type: 'icon',
            val: {
              icon: 'flag',
              color: '#d23726'
            }
          },
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyRemovedFlaggedGiveaway:");
          console.log(error);
        }
      });
    },

    unnotifyRemovedFlaggedGiveaway: (giveawayId) => {
      check(giveawayId, Match._id);

      const giveaway = Giveaways.findOne(giveawayId);

      if (!giveaway)
        return;

      Meteor.call('removeUnreadNotification', `removedFlaggedGiveaway-${giveawayId}`, [ giveaway.userId ], (error, result) => {
        if (error) {
          console.log("Error removing notification in unnotifyRemovedFlaggedGiveaway:");
          console.log(error);
        }
      });
    },

    // Comments

    notifyCommentedOnGiveaway: (giveawayId, commenterId) => {
      check(giveawayId, Match._id);
      check(commenterId, Match._id);

      const giveaway = Giveaways.findOne(giveawayId);

      if (!giveaway)
        return;

      Meteor.call('upsertNotifications', `commentedOnGiveaway-${giveawayId}`, [ giveaway.userId ], (existingData) => {
        const metadata = existingData ? existingData.data.metadata : null;
        const newUserIds = metadata ? metadata.userIds.filter(userId => userId !== commenterId) : [];
        newUserIds.unshift(commenterId);

        const newUserNames = aggregateUserNames(newUserIds);

        return {
          title: `New comment on your giveaway`,
          body: `${newUserNames} commented on ${giveaway.title}.`,
          avatar: {
            type: 'user',
            val: commenterId
          },
          url: `/giveaway/${giveawayId}`,
          metadata: {
            userIds: newUserIds
          },
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyCommentedOnGiveaway:");
          console.log(error);
        }
      });
    },

    notifyModsFlaggedComment: (commentId, flaggerId) => {
      check(commentId, Match._id);
      check(flaggerId, Match._id);

      const comment = GiveawayComments.findOne(commentId);
      const giveaway = Giveaways.findOne(comment.giveawayId);

      if (!comment || !giveaway)
        return;

      Meteor.call('upsertNotifications', `flaggedComment-${commentId}`, modsAdminsUserIds(), (existingData) => {
        const metadata = existingData ? existingData.metadata : null;
        const newUserIds = metadata ? metadata.userIds.filter(userId => userId !== flaggerId) : [];
        newUserIds.unshift(flaggerId);
        const newUserNames = aggregateUserNames(newUserIds);

        return {
          title: `Comment requires review`,
          body: `${newUserNames} ${pluralizer(newUserIds.length, 'has', 'have')} flagged a comment on ${giveaway.title}.`,
          avatar: {
            type: 'icon',
            val: {
              icon: 'flag',
              color: '#d23726'
            }
          },
          url: `/giveaway/${giveaway._id}`,
          metadata: {
            userIds: newUserIds
          },
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyModsFlaggedComment:");
          console.log(error);
        }
      });
    },

    unnotifyModsFlaggedComment: (commentId) => {
      check(commentId, Match._id);

      Meteor.call('removeUnreadNotification', `flaggedComment-${commentId}`, modsAdminsUserIds(), (error, result) => {
        if (error) {
          console.log("Error removing notification in unnotifyModsFlaggedComment:");
          console.log(error);
        }
      });
    },

    notifyRemovedFlaggedComment: (commentId) => {
      check(commentId, Match._id);

      const comment = GiveawayComments.findOne(commentId);
      const giveaway = Giveaways.findOne(comment.giveawayId);

      if (!comment || !giveaway)
        return;

      insertNotification(comment.userId, {
        title: 'Comment deleted',
        body: `Your comment on ${giveaway.title} was reported and removed by our moderators.`,
        avatar: {
          type: 'icon',
          val: {
            icon: 'flag',
            color: '#d23726'
          }
        },
      });
    },

    // Ratings

    notifyVotesChange: (gaTitle, gaId, userId, upvotes, downvotes) => {
      check(gaTitle, String);
      check(gaId, Match._id);
      check(userId, Match._id);
      check(upvotes, Number);
      check(downvotes, Number);
      Meteor.call('upsertNotifications', `votesChange-${gaId}`, [userId], (existingData) => {
        return {
          title: 'Recent Votes',
          body: `Your giveaway ${gaTitle} has recently received ${upvotes} ${pluralizer(upvotes,'upvote', 'upvotes')}
           and ${downvotes} ${pluralizer(downvotes,'downvote', 'downvotes')}`,
          avatar: {
            type: 'icon',
          },
          url: `/giveaway/${gaId}`,
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyVotesChange:");
          console.log(error);
        }
      });
    }

  });
}
