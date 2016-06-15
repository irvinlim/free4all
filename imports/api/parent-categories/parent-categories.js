import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ParentCategories = new Mongo.Collection('ParentCategories');

ParentCategories.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'ParentCategory name',
  },
  iconClass: {
    type: String,
    label: 'The icon class for the category. For FontAwesome: must start with "fa fa-".',
  },
  relativeOrder: {
    type: Number,
    label: 'Relative order to display the statuses in. \
            Smaller values appear at the top whilst larger ones appear at the bottom. \
            Identical values will then be sorted by name in ascending order.'
  },
});


ParentCategories.attachSchema(ParentCategories.schema);
