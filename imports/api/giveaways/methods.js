import { Giveaways, GiveawaysDataSchema } from './giveaways';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// CRUD

export const insertGiveaway = new ValidatedMethod({
  name: 'giveaways.insert',
  validate: GiveawaysDataSchema.validator(),
  run(giveaway) {
    return Giveaways.insert(giveaway);
  },
});

export const updateGiveaway = new ValidatedMethod({
  name: 'giveaways.update',
  validate: new SimpleSchema({
    _id: { type: String },
    'update.title': { type: String, optional: true },
  }).validator(),
  run({ _id, update }) {
    Giveaways.update(_id, { $set: update });
  },
});

export const removeGiveaway = new ValidatedMethod({
  name: 'giveaways.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    Giveaways.remove(_id);
  },
});

// StatusUpdates

export const pushStatusUpdate = new ValidatedMethod({
  name: 'giveaways.pushStatusUpdate',
  validate: new SimpleSchema({
    giveawayId: { type: String },
    statusTypeId: { type: String },
    date: { type: Date },
    userId: { type: String },
  }).validator(),
  run({ giveawayId, statusTypeId, date, userId }) {
    const giveaway = Giveaways.findOne(giveawayId);

    if (!this.userId)
      throw new Meteor.Error("giveaways.pushStatusUpdate.notLoggedIn", "Must be logged in to update status.");
    else if (this.userId != userId)
      throw new Meteor.Error("giveaways.pushStatusUpdate.notAuthenticated", "User ID does not match.");
    else if (!giveaway)
      throw new Meteor.Error("giveaways.pushStatusUpdate.undefinedGiveaway", "No such Giveaway found.");

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
