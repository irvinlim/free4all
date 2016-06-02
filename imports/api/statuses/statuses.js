// import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// import { Factory } from 'meteor/dburles:factory';

export const Statuses = new Mongo.Collection('Statuses');

Statuses.schema = new SimpleSchema({
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
    hexColour:{
        type: String,
        label: 'Hex code for colour that represents the status, on the map marker.'
    },
});

Statuses.attachSchema(Statuses.schema);

// Factory.define('document', Statuses, {
//   title: () => faker.hacker.phrase(),
// });
