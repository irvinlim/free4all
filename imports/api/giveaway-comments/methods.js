import { GiveawayComments } from './giveaway-comments';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Giveaways } from '../giveaways/giveaways';

// Only logged in users can insert comments.
export const insertComment = new ValidatedMethod({
  name: 'giveawayComments.insert',
  validate: new SimpleSchema({
    giveawayId: { type: String },
    userId: { type: String },
    content: { type: String }
  }).validator(),
  run({ giveawayId, userId, content }) {
    const ga = Giveaways.findOne(giveawayId);

    if (!this.userId)
      throw new Meteor.Error("giveawayComments.insertComment.notLoggedIn", "Must be logged in to insert comment.");
    else if (this.userId != userId)
      throw new Meteor.Error("giveawayComments.insertComment.notAuthenticated", "User ID does not match.");
    else if (!ga)
      throw new Meteor.Error("giveawayComments.insertComment.undefinedGiveaway", "No such Giveaway found.");

    // Insert comment
    return GiveawayComments.insert({ giveawayId, userId, content });
  },
});

// Only comment author and mods/admins can edit comments.
export const editComment = new ValidatedMethod({
  name: 'giveawayComments.edit',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: { type: String },
    content: { type: String }
  }).validator(),
  run({ _id, userId, content }) {
    // Get comment
    const comment = GiveawayComments.findOne(_id);

    if (!comment)
      throw new Meteor.Error("giveawayComments.editComment.undefinedComment", "No such comment found.");

    // Check authorized
    const isAuthorized = Roles.userIsInRole(this.userId, ['moderator', 'admin']) || userId == comment.userId;

    if (!this.userId || this.userId != userId)
      throw new Meteor.Error("giveawayComments.editComment.notLoggedIn", "Must be logged in to edit comment.");
    else if (!isAuthorized)
      throw new Meteor.Error("giveawayComments.editComment.notAuthorized", "Not authorized to edit comment.");

    // Update comment
    return GiveawayComments.update(_id, { $set: { content } });
  },
});

// Only comment author and mods/admins can remove comments.
export const removeComment = new ValidatedMethod({
  name: 'giveawayComments.remove',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: { type: String },
  }).validator(),
  run({ _id, userId }) {
    // Get comment
    const comment = GiveawayComments.findOne(_id);

    if (!comment)
      throw new Meteor.Error("giveawayComments.removeComment.undefinedComment", "No such comment found.");

    // Check authorized
    const isAuthorized = Roles.userIsInRole(this.userId, ['moderator', 'admin']) || userId == comment.userId;

    if (!this.userId || this.userId != userId)
      throw new Meteor.Error("giveawayComments.removeComment.notLoggedIn", "Must be logged in to remove comment.");
    else if (!isAuthorized)
      throw new Meteor.Error("giveawayComments.removeComment.notAuthorized", "Not authorized to remove comment.");

    // Update comment
    return GiveawayComments.update(_id, { $set: { isRemoved: true, removeUserId: userId } });
  },
});

// Only non-authors can flag comments.
export const flagComment = new ValidatedMethod({
  name: 'giveawayComments.flag',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: { type: String },
  }).validator(),
  run({ _id, userId }) {
    const comment = GiveawayComments.findOne(_id);

    if (!comment)
      throw new Meteor.Error("giveawayComments.flagComment.undefinedComment", "No such comment found.");
    else if (!this.userId || this.userId != userId)
      throw new Meteor.Error("giveawayComments.flagComment.notLoggedIn", "Must be logged in to flag comment.");
    else if (userId == comment.userId)
      throw new Meteor.Error("giveawayComments.flagComment.cannotFlagOwnComment", "Cannot flag own comment.");

    // Update comment
    return GiveawayComments.update(_id, { $set: { isFlagged: true, flagUserId: userId } });
  },
});

// Only mods/admins can unflag comments.
export const unflagComment = new ValidatedMethod({
  name: 'giveawayComments.unflag',
  validate: new SimpleSchema({
    _id: { type: String },
    userId: { type: String },
  }).validator(),
  run({ _id, userId }) {
    const comment = GiveawayComments.findOne(_id);

    if (!comment)
      throw new Meteor.Error("giveawayComments.unflagComment.undefinedComment", "No such comment found.");

    // Check authorized
    const isAuthorized = Roles.userIsInRole(this.userId, ['moderator', 'admin']);

    if (!this.userId || this.userId != userId)
      throw new Meteor.Error("giveawayComments.unflagComment.notLoggedIn", "Must be logged in to unflag comment.");
    else if (!isAuthorized)
      throw new Meteor.Error("giveawayComments.unflagComment.notAuthorized", "Not authorized to unflag comment.");

    // Update comment
    return GiveawayComments.update(_id, { $set: { isFlagged: false }, $unset: { flagUserId: "" } });
  },
});
