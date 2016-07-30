import { Meteor } from 'meteor/meteor';

import { Giveaways, GiveawayNetRatings, GiveawaysDataSchema } from './giveaways';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { propExistsDeep } from '../../util/helper';
import * as GiveawaysHelper from '../../util/giveaways';

// CRUD

export const insertGiveaway = new ValidatedMethod({
  name: 'giveaways.insert',
  validate: GiveawaysDataSchema.validator(),
  run(giveaway) {
    if (!this.userId)
      throw new Meteor.Error("giveaways.insertGiveaway.notLoggedIn", "Must be logged in to insert giveaway.");

    // Insert giveaway
    return Giveaways.insert(giveaway);
  },
});

export const updateGiveaway = new ValidatedMethod({
  name: 'giveaways.update',
  validate(payload){
    const validator = GiveawaysDataSchema.validator();
    validator(payload.update);
  },
  run({ _id, update }) {
    const giveaway = Giveaways.findOne(_id);

    if (!this.userId)
      throw new Meteor.Error("giveaways.updateGiveaway.notLoggedIn", "Must be logged in to update giveaway.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.updateGiveaway.undefinedGiveaway", "No such Giveaway found.");

    // Update giveaway
    Giveaways.update(_id, { $set: update });
  },
});

export const removeGiveaway = new ValidatedMethod({
  name: 'giveaways.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    const giveaway = Giveaways.findOne(_id);

    if (!this.userId)
      throw new Meteor.Error("giveaways.removeGiveaway.notLoggedIn", "Must be logged in to remove giveaway.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.removeGiveaway.undefinedGiveaway", "No such Giveaway found.");
    else if (giveaway.isRemoved)
      throw new Meteor.Error("giveaways.removeGiveaway.alreadyRemoved", "Giveaway already removed.");

    // Update removed flag, removeUser ID and removeDate
    Giveaways.update({
      _id: _id,
      isRemoved: { $ne: true }
    }, {
      $set: {
        isRemoved: true,
        removeUserId: this.userId,
        removeDate: new Date()
      }
    });
  },
});

export const removeGiveawayGroup = new ValidatedMethod({
  name: 'giveaways.removeGroup',
  validate: new SimpleSchema({
    batchId: { type: String },
  }).validator(),
  run({ batchId }) {
    const giveaways = Giveaways.find({batchId: batchId});

    if (!this.userId)
      throw new Meteor.Error("giveaways.removeGiveawayGroup.notLoggedIn", "Must be logged in to remove giveaway.");
    else if (!giveaways.count())
      throw new Meteor.Error("giveaways.removeGiveawayGroup.undefinedGiveaway", "No such Giveaway found.");

    // Update removed flag, removeUser ID and removedDate.
    // Don't update giveaways that have already been previously removed.
    Giveaways.update({
      batchId: batchId,
      isRemoved: { $ne: true }
    }, {
      $set: {
        isRemoved: true,
        removeUserId: this.userId,
        removeDate: new Date()
      }
    });
  },
});

// Flags

export const flagGiveaway = new ValidatedMethod({
  name: 'giveaways.flag',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: { type: String },
  }).validator(),
  run({ _id, userId }) {
    const giveaway = Giveaways.findOne(_id);

    if (!this.userId || this.userId != userId)
      throw new Meteor.Error("giveaways.flagGiveaway.notLoggedIn", "Must be logged in to flag giveaway.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.flagGiveaway.undefinedGiveaway", "No such Giveaway found.");
    else if (userId == giveaway.userId)
      throw new Meteor.Error("giveaways.flagGiveaway.cannotFlagOwnGiveaway", "You cannot flag your own giveaway.");

    if (GiveawaysHelper.userHasFlagged(giveaway, userId))
      Giveaways.update(_id, {
        $pull: { flags: { userId } },
      });

    // Push flag by user
    Giveaways.update(_id, {
      $push: { flags: { userId, date: new Date() } },
    });
  },
});

export const unflagGiveaway = new ValidatedMethod({
  name: 'giveaways.unflag',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: { type: String },
  }).validator(),
  run({ _id, userId }) {
    const giveaway = Giveaways.findOne(_id);

    if (!giveaway)
      throw new Meteor.Error("giveaways.unflagGiveaway.undefinedGiveaway", "No such Giveaway found.");

    const isAuthorized = Roles.userIsInRole(this.userId, ['moderator', 'admin']);

    if (!this.userId || this.userId != userId)
      throw new Meteor.Error("giveaways.unflagGiveaway.notLoggedIn", "Must be logged in to unflag giveaway.");
    else if (!isAuthorized)
      throw new Meteor.Error("giveaways.unflagGiveaway.notAuthorized", "Not authorized to unflag giveaway.");

    // Clear all flags
    Giveaways.update(_id, {
      $set: { flags: [] },
    });
  },
});

// StatusUpdates

export const pushStatusUpdate = new ValidatedMethod({
  name: 'giveaways.pushStatusUpdate',
  validate: new SimpleSchema({
    giveawayId: { type: String },
    statusTypeId: { type: String },
    userId: { type: String },
  }).validator(),
  run({ giveawayId, statusTypeId, userId }) {
    const giveaway = Giveaways.findOne(giveawayId);
    const date = new Date();

    if (!this.userId)
      throw new Meteor.Error("giveaways.pushStatusUpdate.notLoggedIn", "Must be logged in to update status.");
    else if (this.userId != userId)
      throw new Meteor.Error("giveaways.pushStatusUpdate.notAuthenticated", "User ID does not match.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.pushStatusUpdate.undefinedGiveaway", "No such Giveaway found.");

    // Check if have same user update in the last minute, and modify that update instead of pushing.
    // Remove any updates within the last minute before pushing the new one.
    const oneMinAgo = moment(date).subtract(1, 'minutes');
    const notWithinLastMinute = giveaway.statusUpdates.filter(su => moment(su.date).isBefore(oneMinAgo));

    if (notWithinLastMinute.length && notWithinLastMinute.length < giveaway.statusUpdates.length)
      Giveaways.update(giveawayId, {
        $set: { statusUpdates: notWithinLastMinute }
      });

    // Push new status update
    Giveaways.update(giveawayId, {
      $push: { statusUpdates: { statusTypeId, date, userId } }
    });
  },
});

// Ratings

export const voteUp = new ValidatedMethod({
  name: 'giveaways.voteUp',
  validate: new SimpleSchema({
    userId: { type: String },
    giveawayId: { type: String },
  }).validator(),
  run({ userId, giveawayId }) {
    const giveaway = Giveaways.findOne(giveawayId);

    if (!this.userId)
      throw new Meteor.Error("giveaways.voteUp.notLoggedIn", "Must be logged in to vote.");
    else if (this.userId != userId)
      throw new Meteor.Error("giveaways.voteUp.notAuthenticated", "User ID does not match.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.voteUp.undefinedGiveaway", "No such Giveaway found.");

    Giveaways.update(giveawayId, {
      $push: { 'ratings.upvotes': { userId, date: new Date() } },
      $pull: { 'ratings.downvotes': { userId } }
    });
  },
});

export const voteDown = new ValidatedMethod({
  name: 'giveaways.voteDown',
  validate: new SimpleSchema({
    giveawayId: { type: String },
    userId: { type: String },
  }).validator(),
  run({ userId, giveawayId }) {
    const giveaway = Giveaways.findOne(giveawayId);

    if (!this.userId)
      throw new Meteor.Error("giveaways.voteDown.notLoggedIn", "Must be logged in to vote.");
    else if (this.userId != userId)
      throw new Meteor.Error("giveaways.voteDown.notAuthenticated", "User ID does not match.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.voteDown.undefinedGiveaway", "No such Giveaway found.");

    Giveaways.update(giveawayId, {
      $push: { 'ratings.downvotes': { userId, date: new Date() } },
      $pull: { 'ratings.upvotes': { userId } }
    });
  },
});

export const unvote = new ValidatedMethod({
  name: 'giveaways.unvote',
  validate: new SimpleSchema({
    giveawayId: { type: String },
    userId: { type: String },
  }).validator(),
  run({ userId, giveawayId }) {
    const giveaway = Giveaways.findOne(giveawayId);

    if (!this.userId)
      throw new Meteor.Error("giveaways.unvote.notLoggedIn", "Must be logged in to vote.");
    else if (this.userId != userId)
      throw new Meteor.Error("giveaways.unvote.notAuthenticated", "User ID does not match.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.unvote.undefinedGiveaway", "No such Giveaway found.");

    Giveaways.update(giveawayId, {
      $pull: {
        'ratings.upvotes': { userId },
        'ratings.downvotes': { userId },
      }
    });
  },
});


if (Meteor.isServer) {

  // GiveawayNetRatings
  Meteor.methods({
    'giveaways.getNetRatingIDs': function(options) {
      return GiveawayNetRatings.find({}, options).map(doc => doc._id);
    }
  });

  // Google Analytics

  const getGaPageViewsFor = (path) => {
    var fut = new Future();

    const options = {
     'ids': 'ga:' + Meteor.settings.public.GoogleAnalytics.profileId,
      'start-date': '2005-01-01',
      'end-date': 'today',
      'dimensions': 'ga:pagePath',
      'metrics': 'ga:pageviews',
      'filters': 'ga:pagePath==' + path
    };

    GoogleAnalytics.get(options, function(err, entries) {
      if (!err) {
        let ret = 0;

        if (propExistsDeep(entries, [0, 'metrics', 0, 'ga:pageviews']))
          ret = entries[0].metrics[0]['ga:pageviews'];

        fut['return'](ret);
      }
    });

    // Wait for async to finish before returning the result
    return fut.wait();
  };

  Meteor.methods({
    'giveaways.getPageviews': function(gaId) {
      check(gaId, String);
      return getGaPageViewsFor('/giveaway/' + gaId);
    },
    'giveaways.getInfoboxOpens': function(gaId) {
      check(gaId, String);
      return getGaPageViewsFor('/modal/giveaway/infobox-open/' + gaId);
    },
  });

}
