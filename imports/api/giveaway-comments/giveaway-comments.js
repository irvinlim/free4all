import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const GiveawayComments = new Mongo.Collection('GiveawayComments');

GiveawayComments.schema = new SimpleSchema({
  giveawayId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of giveaway that this comment is attached to'
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of user who gave this comment'
  },
  content: {
    type: String,
    label: 'Comment label'
  },

  createdAt: {
    type: Date,
    label: 'Date that comment was created',
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
    label: 'Date that comment was updated',
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    optional: true
  },

  isFlagged: {
    type: Boolean,
    label: 'Whether the comment is flagged',
    defaultValue: false
  },
  flagUserId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of user who flagged this comment',
    optional: true
  },
  flagDate: {
    type: Date,
    label: 'Date when comment was flagged',
    optional: true
  },
  isRemoved: {
    type: Boolean,
    label: 'Whether the comment has been removed',
    defaultValue: false
  },
  removeUserId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of user who removed this comment',
    optional: true
  },
  removeDate: {
    type: Date,
    label: 'Date when comment was removed',
    optional: true
  }
});

GiveawayComments.attachSchema(GiveawayComments.schema);
