// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const ParentCategories = new Mongo.Collection('ParentCategories');

ParentCategories.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'The name of the parent category.',
  },
  icon: {
    type: String,
    label: 'The font icon name/class of the parent category. For FontAwesome, must be preceded with "fa-".',
  },
  iconPackage: {
    type: String,
    label: 'The font icon package to be used. If empty, material-icons will be used.',
    optional: true,
  },
  relativeOrder: {
    type: Number,
    label: 'Relative order to display the statuses in. \
    Smaller values appear at the top whilst larger ones appear at the bottom. \
    Identical values will then be sorted by name in ascending order.'
  },
});

ParentCategories.attachSchema(ParentCategories.schema);

// Factory.define('document', ParentCategories, {
//   title: () => faker.hacker.phrase(),
// });
