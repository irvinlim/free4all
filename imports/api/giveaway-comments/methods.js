import { GiveawayComments } from './giveaway-comments';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Giveaways } from '../giveaways/giveaways';

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

    // Insert giveaway
    return GiveawayComments.insert({ giveawayId, userId, content });
  },
});
