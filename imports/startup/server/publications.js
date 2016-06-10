import { Meteor } from 'meteor/meteor';

Meteor.publish('heraldNotifications', () => Herald.getNotifications({ medium: 'onsite' }));
