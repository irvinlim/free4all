import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export const getHandleLogout = (options) => (event) => {
  Meteor.logout(() => {
    Bert.alert('Logged out.', 'success');

    // Go to main page to avoid complicated checking of requireAuth
    browserHistory.push('/');

    // Clear logged in user's homeLocation Session variable
    Session.clearPersistent('homeLocation');

    if (options && options.callback)
      options.callback();
  });
};
