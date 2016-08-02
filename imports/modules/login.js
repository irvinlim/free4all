import $ from 'jquery';
import 'jquery-validation';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { getInputValue } from './get-input-value';

import { updateProfileFacebook, updateProfileGoogle, updateProfileIVLE, joinCommunity } from '../api/users/methods';

const login = (options) => {
  const email = getInputValue(options.component.refs.emailAddress);
  const password = getInputValue(options.component.refs.password);

  Meteor.loginWithPassword(email, password, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');

      if (options.failedLogin)
        options.failedLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    } else {
      Bert.alert('Logged in!', 'success');

      if (options.afterLogin)
        options.afterLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    }
  });
};

const facebookLogin = (options) => {
  Meteor.loginWithFacebook({}, function(err){
    if (err) {
      Bert.alert("Could not login with Facebook.", 'danger');

      if (options.failedLogin)
        options.failedLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    } else {
      Bert.alert('Logged in!', 'success');

      updateProfileFacebook.call({ userId: Meteor.userId() });

      if (options.afterLogin)
        options.afterLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    }
  });
};

const googleLogin = (options) => {
  Meteor.loginWithGoogle({}, function(err){
    if (err) {
      Bert.alert("Could not login with Google.", 'danger');

      if (options.failedLogin)
        options.failedLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    } else {
      Bert.alert('Logged in!', 'success');

      updateProfileGoogle.call({ userId: Meteor.userId() });

      if (options.afterLogin)
        options.afterLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    }
  });
};

const ivleLogin = (options) => {
  Meteor.loginWithIVLE({}, function(err){
    if (err) {
      Bert.alert("Could not login with IVLE.", 'danger');

      if (options.failedLogin)
        options.failedLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    } else {
      Bert.alert('Logged in!', 'success');

      updateProfileIVLE.call({ userId: Meteor.userId() });

      if (options.afterLogin)
        options.afterLogin();

      if (options.finishedLogin)
        options.finishedLogin();
    }
  });
};

const validate = (options) => {
  let hasAttemptSubmit = false;

  $(options.component.refs.login).validate({
    rules: {
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      emailAddress: {
        required: 'Please enter your email address.',
        email: 'Is this a valid email address?',
      },
      password: {
        required: 'Please enter your password.',
      },
    },
    onfocusout() {
      // Don't perform eager validation unless attempted to submit before.
      if (!hasAttemptSubmit)
        return;

      // Clear existing error messages first
      options.clearErrors();

      // Validate whole form
      this.form();
    },
    errorPlacement($error, $el) {
      // Get/set individual error messages,
      // reverse engineered from a jQuery object.
      $.each($error, (idx, er) => {
        const className = $el[idx].name;
        const errorText = $error[idx].textContent;
        options.setError(className, errorText);
      });
    },
    invalidHandler() {
      // Set flag to true; this will enable onfocusout validation
      hasAttemptSubmit = true;
    },
    submitHandler() {
      // Clear existing error messages first
      options.clearErrors();

      // Hand over to authentication method
      login(options);
    },
  });
};

/**
 * Use this as a template for form validation.
 *
 * @param  options      Options object.
 *   Required options:
 *    - (object)   component            React component with refs to each TextField.
 *    - (function) clearErrors()        A method to clear the existing error messages.
 *    - (function) setError(ref, msg)   A method to set an error message for a particular TextField specified by ref.
 *   Optional options:
 *    - (function) afterLogin           Callback method after authentication success.
 *    - (function) failedLogin          Callback method after authentication failed.
 *    - (function) finishedLogin        Callback method regardless whether authentication succeeded or failed.
 */
export const handleLogin = (options) => {
  validate(options);
};

export const handleFacebookLogin = (options) => {
  facebookLogin(options);
};

export const handleGoogleLogin = (options) => {
  googleLogin(options);
};

export const handleIVLELogin = (options) => {
  ivleLogin(options);
};
