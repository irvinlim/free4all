GoogleAnalytics = {};

const GAPI = require("gapitoken");
const GAnalytics = require('googleanalytics');
let pollToken;

var gapi = new GAPI({
  iss: Meteor.settings.private.GoogleAnalytics.emailAddress,
  key: Meteor.settings.private.GoogleAnalytics.privateKey,
  scope: "https://www.googleapis.com/auth/analytics",
}, function() {
  // Set GAPI token
  getGAPIToken();

  // Refresh the GAPI token every 45 minutes
  pollToken = setInterval(getGAPIToken, 60000 * 45);
});

const getGAPIToken = () => {
  gapi.getToken(function(err, token) {
    console.log("Refreshed Google Analytics token: " + token);

    if (err) {
      console.log(err);
    } else {
      GoogleAnalytics = new GAnalytics.GA({ token });
    }
  });
};
