import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Communities = new Mongo.Collection('Communities');

Communities.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Community name'
  },
  description: {
    type: String,
    label: 'Community description'
  },
  pictureId: {
    type: String,
    label: 'Public ID of Cloudinary image'
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'ID of user who created community'
  },
  count: {
    type: Number,
    label: 'Sum of people in community'
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
  },
  mapURL: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    autoValue: function(){
      if(!this.isSet){
        const id = Meteor.settings.public.MapBox.mapID;
        const accessToken = Meteor.settings.public.MapBox.accessToken;
        return "https://api.tiles.mapbox.com/v4/"+ id +"/{z}/{x}/{y}.png?access_token=" + accessToken;
      }
    },
    label: 'Mapbox studio style'
  },
  createdAt: {
    type: Date,
    label: 'Published date/time',
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();
      }
    }
  }
});

Communities.attachSchema(Communities.schema);

if (Meteor.isServer) {
  Communities._ensureIndex({
    'name': 'text',
    'website': 'text',
  });
}