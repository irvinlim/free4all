GoogleAnalytics = {};

const GAPI = require("gapitoken");
const GAnalytics = require('googleanalytics');

var gapi = new GAPI({
  iss: Meteor.settings.private.GoogleAnalytics.emailAddress,
  key: Meteor.settings.private.GoogleAnalytics.privateKey,
  scope: "https://www.googleapis.com/auth/analytics",
}, function() {
  gapi.getToken(function(err, token) {
    console.log("Google Analytics token: " + token);

    if (err) {
      console.log(err);
    } else {
      GoogleAnalytics = new GAnalytics.GA({ token });
    }
  });
});
