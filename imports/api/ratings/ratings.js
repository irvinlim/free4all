// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const Ratings = new Mongo.Collection('Ratings');

Ratings.schema = new SimpleSchema({
  giveawayId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of the giveaway associated with this rating.',
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of the user who gave this rating.',
  },
  isUpvote: {
    type: Boolean,
    label: 'True if rating is an upvote, false if it is a downvote.'
  }
});

Ratings.attachSchema(Ratings.schema);

// Factory.define('document', Ratings, {
//   title: () => faker.hacker.phrase(),
// });
