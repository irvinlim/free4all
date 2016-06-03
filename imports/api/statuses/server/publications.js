import { Meteor } from 'meteor/meteor';
import { Statuses } from '../statuses';

Meteor.publish('statuses', () => Statuses.find());
