import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Categories = new Mongo.Collection('Categories');

Categories.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Category name',
  },
  iconClass: {
    type: String,
    label: 'The icon class for the category. For FontAwesome: must start with "fa fa-".',
  },
  parent: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ParentCategory ID',
  },
  relativeOrder: {
    type: Number,
    label: 'Relative order to display the statuses in. \
            Smaller values appear at the top whilst larger ones appear at the bottom. \
            Identical values will then be sorted by name in ascending order.'
  },
});

Categories.attachSchema(Categories.schema);
