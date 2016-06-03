// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const StatusTypes = new Mongo.Collection('StatusTypes');

StatusTypes.schema = new SimpleSchema({
  label: {
    type: String,
    label: 'Descriptive label for the status type.'
  },
  hexColour:{
    type: String,
    regEx: /^#([A-Fa-f0-9]{6})$/,
    label: 'Hex colour code that represents the status, on the map marker.'
  },
  relativeOrder: {
    type: Number,
    label: 'Relative order to display the StatusTypes in. \
            Smaller values appear at the top whilst larger ones appear at the bottom. \
            Identical values will then be sorted by name in ascending order.'
  },
});

StatusTypes.attachSchema(StatusTypes.schema);

// Factory.define('document', StatusTypes, {
//   title: () => faker.hacker.phrase(),
// });
