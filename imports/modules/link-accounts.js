import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Facebook } from 'meteor/facebook';
import { Google } from 'meteor/google';
import { IVLE } from 'meteor/irvinlim:ivle';
import { OAuth } from 'meteor/oauth';

import { capitalizeFirstLetter } from '../util/helper';
import { updateProfileFacebook, updateProfileGoogle, updateProfileIVLE } from '../api/users/methods';

const linkAccount = (service, servicePackage, request, handler) => {
  servicePackage.requestCredential(request, (token) => {
    const secret = OAuth._retrieveCredentialSecret(token);
    return Meteor.call("users.addOauthCredentials", token, secret, service, function(err, resp) {
      if (err != null) {
        Bert.alert(`Could not link ${capitalizeFirstLetter(service)}.`, 'warning');
        throw new Meteor.Error(err.error, err.reason);
      } else {
        Bert.alert(`Successfully linked ${capitalizeFirstLetter(service)}!`, 'success');
        handler.call({ userId: Meteor.userId() });
      }
    });
  });
};

export const linkFacebook = (options) => {
  linkAccount('facebook', Facebook, {
    requestPermissions: ["email"]
  }, updateProfileFacebook);
};

export const linkGoogle = (options) => {
  linkAccount('google', Google, {
    requestPermissions: ["email"],
    requestOfflineToken: true
  }, updateProfileGoogle);
};

export const linkIVLE = (options) => {
  linkAccount('ivle', IVLE, {}, updateProfileIVLE);
};
