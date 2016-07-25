import { Meteor } from 'meteor/meteor';

// ShareIt
ShareIt.configure({
  sites: {                // nested object for extra configurations
    'facebook': {
      'appId': Meteor.settings.public.Facebook.appId
    },
    'twitter': {},
    'googleplus': {}
  },
  classes: "large btn share",
                        // The classes that will be placed on the sharing buttons, bootstrap by default.
  iconOnly: false,      // boolean (default: false)
                        // Don't put text on the sharing buttons
  applyColors: true,    // boolean (default: true)
                        // apply classes to inherit each social networks background color
  faSize: '',           // font awesome size
  faClass: ''           // font awesome classes like square
});
