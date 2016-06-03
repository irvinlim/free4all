import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { StatusUpdates } from '../status-updates';

Meteor.publish('status-updates-for-giveaway', gaId => {
  check(gaId, Match.Where(function(str){
    check(str, String);
    var regexp = SimpleSchema.RegEx.Id;
    return regexp.test(str);
  }));

  return StatusUpdates.find({ giveawayId: gaId });
});
