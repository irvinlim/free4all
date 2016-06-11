import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../api/giveaways/giveaways';
Giveaways._ensureIndex({'coordinates':'2d'});
