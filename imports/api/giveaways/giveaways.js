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
        label: 'The icon of the category.',
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
        label: 'The date that status was set'
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
        label: "Last date this book was checked out",
    },
    dateEnd: {
        type: Date,
        label: "Last date this book was checked out",
    },
    location: {
        type: Object,
        index: '2dsphere',
        label: 'MongoDB spesific coordinates field'
    },
    'location.type': {
        type: String,
        allowedValues: ['Point'],
        label: 'Typeof coordinates - Point'
    },
    'location.coordinates': {
        type: [Number],
        decimal: true,
        label: 'Array of coordinates in MongoDB style \[Lng, Lat\]'
    },
    //   Markers.insert({ user: Session.get('user'), location: {"type": "Point", "coordinates": [event.latLng.lng(), event.latLng.lat()]}});
    'category' :{
        type: [CategorySchema],
        minCount: 1,
        maxCount: 1
    },
    'hashtags': {
        type: [String],
        label: 'The hashtags for users',
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
