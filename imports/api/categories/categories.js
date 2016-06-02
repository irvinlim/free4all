// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const Categories = new Mongo.Collection('Categories');

Categories.schema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    name: {
        type: String,
        label: 'The name of the category.',
    },
    icon: {
        type: String,
        label: 'The SVG icon name of the category (according to Material-UI).',
    },
});

Categories.attachSchema(Categories.schema);

// Factory.define('document', Categories, {
//   title: () => faker.hacker.phrase(),
// });
