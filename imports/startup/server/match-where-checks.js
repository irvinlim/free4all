import { Meteor } from 'meteor/meteor';

// Read more:
// http://0rocketscience.blogspot.sg/2015/12/meteor-security-no-4-extending-match.html

Match._id = Match.Where(function (id) {
  check(id, String);
  return /[a-zA-Z0-9]{17,17}/.test(id);
});

