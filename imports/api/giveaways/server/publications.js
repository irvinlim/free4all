import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../giveaways';

Meteor.publish('giveaways', () => Giveaways.find());
