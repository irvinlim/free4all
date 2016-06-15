import { Meteor } from 'meteor/meteor';

Cloudinary.config({
  cloud_name: Meteor.settings.public.Cloudinary.cloudName,
  api_key: Meteor.settings.private.Cloudinary.apiKey,
  api_secret: Meteor.settings.private.Cloudinary.apiSecret,
});
