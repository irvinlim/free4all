import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../categories';

Meteor.publish('giveaways', () => Giveaways.find());
