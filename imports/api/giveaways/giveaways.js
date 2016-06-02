// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const Giveaways = new Mongo.Collection('Giveaways');

CategorySchema = new SimpleSchema({
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
})

StatusSchema = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    status: {
        type: String,
        label: 'Status types: Available, Going, Gone.'
    },
    dateSetOn:{
        type: Date,
        label: 'The date that status was set.'
    },
})

Giveaways.schema = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    title: {
        type: String,
        label: 'The title of the giveaway.',
    },
    description: {
        type: String,
        label: 'The description of the giveaway.',
    },
    dateStart: {
        type: Date,
        label: "Start date/time of the giveaway.",
    },
    dateEnd: {
        type: Date,
        label: "End date/time of the giveaway.",
    },
    location: {
        type: String,
        label: 'Localized name of location (reverse geocoded)'
    },
    'coordinates': {
        type: [Number],
        decimal: true,
        label: 'Array of coordinates in MongoDB style \[Lng, Lat\]'
    },
    'category' :{
        type: CategorySchema,
    },
    'hashtags': {
        type: [String],
        label: 'The hashtags of the giveaway.',
        optional: true
    },
    'status': {
        type: [StatusSchema],
        minCount: 1,
        maxCount: 1,
        label: 'Current Status of the giveaway'
    }

});

Giveaways.attachSchema(Giveaways.schema);

// Factory.define('document', Giveaways, {
//   title: () => faker.hacker.phrase(),
// });
