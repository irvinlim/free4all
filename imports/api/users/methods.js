import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { propExistsDeep } from '../../util/helper';

export const addEmailFromFacebook = new ValidatedMethod({
  name: 'users.addEmailFromFacebook',
  validate: new SimpleSchema({
    userId: { type: String }
  }).validator(),
  run({ userId }) {
    const user = Meteor.users.findOne(userId);

    if (!user)
      return;

    if (!propExistsDeep(user, ['services', 'facebook', 'email']))
      return;

    if (!user.emails || !user.emails.length)
      Meteor.users.update( { _id: user._id }, { $set: { emails: [{ address: user.services.facebook.email, verified: false }] } });
  },
});
