import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Communities = new Mongo.Collection('Communities');

Communities.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Community name'
  },
  pictureId: {
    type: String,
    label: 'Public ID of Cloudinary image'
  },
  ownerId: {
    type: String,
    label: '_id of user who created group'
  },
  count: {
    type: Number,
    label: 'Sum of people in group for resubscription on change'
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  coordinates:{
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2,
    label: 'Array of coordinates in MongoDB style \[Lng, Lat\]'
  },
  zoom: {
    type: Number,
    label: 'Zoom level of map',
    defaultValue: 15
  }
});

Communities.attachSchema(Communities.schema);
