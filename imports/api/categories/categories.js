// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';
//
import { ParentCategories } from '../parent-categories/parent-categories';

export const Categories = new Mongo.Collection('Categories');

Categories.schema = new SimpleSchema({
    name: {
        type: String,
        label: 'The name of the category.',
    },
    icon: {
        type: String,
        label: 'The SVG icon name of the category (according to Material-UI).',
    },
    parent: {
        type: ParentCategories.schema,
        label: 'Parent category for this category.',
    },
    relativeOrder: {
        type: Number,
        label: 'Relative order to display the statuses in. \
                Smaller values appear at the top whilst larger ones appear at the bottom. \
                Identical values will then be sorted by name in ascending order.'
    },
});

Categories.attachSchema(Categories.schema);

// Factory.define('document', Categories, {
//   title: () => faker.hacker.phrase(),
// });
