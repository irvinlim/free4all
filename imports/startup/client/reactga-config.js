import { Meteor } from 'meteor/meteor';

ReactGA = require('react-ga');

ReactGA.initialize(Meteor.settings.public.GoogleAnalytics.trackingId);
