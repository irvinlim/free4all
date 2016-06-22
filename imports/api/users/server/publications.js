import { Meteor } from 'meteor/meteor';

Meteor.publish('user-data', function() {
  return Meteor.users.find(this.userId, {
    fields: {
      'services.facebook.id': true,
      'services.google.picture': true,
    },
  });
});
