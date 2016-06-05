import React from 'react/react';
import { Meteor } from 'meteor/meteor';
const nl2brReact = require('react-nl2br');

// Console
export const log = msg => process.env.NODE_ENV === "development" ? console.log(msg) : null;
export const logIf = (x, msg) => x && process.env.NODE_ENV === "development" ? console.log(msg) : null;
export const warn = msg => process.env.NODE_ENV === "development" ? console.warn(msg) : null;
export const warnIf = (x, msg) => x && process.env.NODE_ENV === "development" ? console.warn(msg) : null;
export const error = msg => { if (process.env.NODE_ENV === "development") throw new Error(msg); };
export const errorIf = (x, msg) => { if (x && process.env.NODE_ENV === "development") throw new Error(msg); };

// Strings
export const sanitizeStringSlug = (s) => s.replace(/[^a-zA-Z0-9 -_]/g, "");
export const sanitizeHexColour = (s) => s.replace(/[^a-fA-F0-9#]/g, "");
export const nl2br = s => nl2brReact(s);

// Dates
export const compact_date_range = (start, end) => {
  moment.updateLocale('en', {
    calendar: {
      lastDay : '[yesterday at] LT',
      sameDay : '[today at] LT',
      nextDay : '[tomorrow at] LT',
      lastWeek : '[last] dddd [at] LT',
      nextWeek : 'dddd [at] LT',
      sameElse : 'L'
    }
  });

  start = moment(start);
  end = moment(end);
  now = moment();

  if (start.isAfter(now)) {
    // Haven't start
    return "Starts " + start.calendar(now);
  } else if (end.isBefore(now)) {
    // Already ended
    return "Ended " + end.calendar(now);
  } else {
    // Ongoing
    return "Ending " + end.calendar();
  }
}

export const is_ongoing = (start, end) => moment(start).isBefore(moment()) && moment(end).isAfter(moment());
export const is_havent_start = (start, end) => moment(start).isAfter(moment());
export const is_over = (start, end) => moment(end).isBefore(moment());
