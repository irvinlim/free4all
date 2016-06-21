import { Meteor } from 'meteor/meteor';

ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: Meteor.settings.public.Facebook.appID,
  secret: Meteor.settings.private.Facebook.appSecret
});
