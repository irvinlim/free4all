// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const StatusUpdates = new Mongo.Collection('StatusUpdates');

StatusUpdates.schema = new SimpleSchema({
  'giveawayId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of Giveaway associated with this status update.'
  },
  'statusTypeId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of Status.'
  },
  'date': {
    type: Date,
    label: 'Date that the status was set.'
  },
  'userId': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of User who updated this status.'
  },
});

StatusUpdates.attachSchema(StatusUpdates.schema);

// Factory.define('document', StatusUpdates, {
//   title: () => faker.hacker.phrase(),
// });
