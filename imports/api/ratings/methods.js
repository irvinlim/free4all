import { Meteor } from 'meteor/meteor';
import { Ratings } from './ratings';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Use upsert: Allow insertion using update.

// ======= NOTICE ===========

// Meteor does not yet support unique indexes across multiple fields.
// To get around this potential issue, we should create an index directly
// within MongoDB itself.

export const voteUp = new ValidatedMethod({
  name: 'ratings.voteUp',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    userId: { type: String },
    giveawayId: { type: String },
  }).validator(),
  run({ userId, giveawayId }) {
    if (!this.userId)
      throw new Meteor.Error("ratings.voteUp.notLoggedIn", "Must be logged in to vote.");
    else if (this.userId != userId)
      throw new Meteor.Error("ratings.voteUp.notAuthenticated", "User ID does not match.");

    Ratings.upsert({ userId, giveawayId }, {
      $set: { userId, giveawayId, isUpvote: true, },
    });
  },
});

export const voteDown = new ValidatedMethod({
  name: 'ratings.voteDown',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    giveawayId: { type: String },
    userId: { type: String },
  }).validator(),
  run({ userId, giveawayId }) {
    if (!this.userId)
      throw new Meteor.Error("ratings.voteDown.notLoggedIn", "Must be logged in to vote.");
    else if (this.userId != userId)
      throw new Meteor.Error("ratings.voteDown.notAuthenticated", "User ID does not match.");

    Ratings.upsert({ userId, giveawayId }, {
      $set: { userId, giveawayId, isUpvote: false, },
    });
  },
});

export const unvote = new ValidatedMethod({
  name: 'ratings.unvote',
  validate: new SimpleSchema({
    _id: { type: String, optional: true },
    giveawayId: { type: String },
    userId: { type: String },
  }).validator(),
  run({ userId, giveawayId }) {
    if (!this.userId)
      throw new Meteor.Error("ratings.voteDown.notLoggedIn", "Must be logged in to vote.");
    else if (this.userId != userId)
      throw new Meteor.Error("ratings.voteDown.notAuthenticated", "User ID does not match.");

    Ratings.remove({ userId, giveawayId });
  },
});
