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

    let ratings = giveaway.ratings ? giveaway.ratings.filter(rating => rating.userId != userId) : [];
    ratings.push({ userId, isUpvote: true });

    Giveaways.update({ _id: giveawayId }, {
      $set: { ratings },
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

    let ratings = giveaway.ratings ? giveaway.ratings.filter(rating => rating.userId != userId) : [];
    ratings.push({ userId, isUpvote: false });

    Giveaways.update({ _id: giveawayId }, {
      $set: { ratings },
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

    let ratings = giveaway.ratings ? giveaway.ratings.filter(rating => rating.userId != userId) : [];

    Giveaways.update({ _id: giveawayId }, {
      $set: { ratings },
    });
  },
});
