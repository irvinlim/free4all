import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Ratings = new Mongo.Collection('Ratings');

Ratings.schema = new SimpleSchema({
  giveawayId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Giveaway ID associated with this rating',
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of user who gave this rating.',
  },
  isUpvote: {
    type: Boolean,
    label: 'True if rating is an upvote, false if it is a downvote'
  }
});

Ratings.attachSchema(Ratings.schema);
