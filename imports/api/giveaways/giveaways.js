import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Giveaways = new Mongo.Collection('Giveaways');

export const StatusUpdatesSchema = new SimpleSchema({
  statusTypeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'StatusType ID'
  },
  date: {
    type: Date,
    label: 'Date that the status was set'
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of User who updated this status.'
  },
});

export const RatingsSchema = new SimpleSchema({
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

export const GiveawaysDataSchema = new SimpleSchema({
  // Data fields
  title: {
    type: String,
    label: 'Giveaway title',
  },
  description: {
    type: String,
    label: 'Giveaway description',
  },
  startDateTime: {
    type: Date,
    label: 'Giveaway start date/time',
  },
  endDateTime: {
    type: Date,
    label: 'Giveaway end date/time',
  },
  location: {
    type: String,
    label: 'English name of giveaway location'
  },
  coordinates: {
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2,
    label: 'Array of coordinates in MongoDB style \[Lng, Lat\]'
  },
  categoryId :{
    type: String,
    label: 'Category ID'
  },
  tags: {
    type: [String],
    label: 'Giveaway tags',
    optional: true
  },
  avatarId: {
    type: String,
    label: 'Public ID of image avatar (Cloudinary)',
    optional: true,
  },
  batchId: {
    type: String,
    label: 'Batch Id of recurring group'
  },
  statusUpdates: {
    type: [StatusUpdatesSchema],
    label: 'Status updates for giveaway',
    optional: true,
  },
  ratings: {
    type: [RatingsSchema],
    label: 'User ratings for giveaway',
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of User who posted this giveaway'
  },
  deleted: {
    type: Boolean,
    label: 'Locally deleted?',
    optional: true
  },
});

export const GiveawaysMetaSchema = new SimpleSchema({
  // Meta fields
  createdAt: {
    type: Date,
    label: 'Published date/time',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();
      }
    }
  },
  updatedAt: {
    type: Date,
    label: 'Last edit date/time',
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  }
});

Giveaways.schema = new SimpleSchema([ GiveawaysDataSchema, GiveawaysMetaSchema ]);
Giveaways.attachSchema(Giveaways.schema);

if (Meteor.isServer) {
  Giveaways._ensureIndex({'coordinates':'2dsphere'});
  Giveaways._ensureIndex({
    'title': 'text',
    'description': 'text',
    'location': 'text',
  });
}
