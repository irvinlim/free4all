import { Meteor } from 'meteor/meteor';

// Facebook
ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: Meteor.settings.public.Facebook.appId,
  secret: Meteor.settings.private.Facebook.appSecret
});

// Google
ServiceConfiguration.configurations.remove({
  service: 'google'
});

ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: Meteor.settings.public.Google.clientId,
  secret: Meteor.settings.private.Google.clientSecret
});

// IVLE
ServiceConfiguration.configurations.remove({
  service: 'ivle'
});

ServiceConfiguration.configurations.insert({
  service: 'ivle',
  apiKey: Meteor.settings.public.IVLE.apiKey
});

// Kadira
Kadira.connect(Meteor.settings.private.kadira.appId, Meteor.settings.private.kadira.appSecret);