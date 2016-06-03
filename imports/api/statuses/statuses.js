// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const Statuses = new Mongo.Collection('Statuses');

Statuses.schema = new SimpleSchema({
  status: {
    type: String,
    label: 'Descriptive label for the status type.'
  },
  hexColour:{
    type: String,
    label: 'Hex colour code that represents the status, on the map marker.'
  },
  relativeOrder: {
    type: Number,
    label: 'Relative order to display the statuses in. \
    Smaller values appear at the top whilst larger ones appear at the bottom. \
    Identical values will then be sorted by name in ascending order.'
  },
});

Statuses.attachSchema(Statuses.schema);

// Factory.define('document', Statuses, {
//   title: () => faker.hacker.phrase(),
// });
