import React from 'react/react';
import { Meteor } from 'meteor/meteor';

export const warn = msg => process.env.NODE_ENV === "development" ? console.warn(msg) : null;

export const warnIf = (x, msg) => x && process.env.NODE_ENV === "development" ? console.warn(msg) : null;

export const error = msg => {
  if (process.env.NODE_ENV === "development") throw new Error(msg);
};

export const errorIf = (x, msg) => {
  if (x && process.env.NODE_ENV === "development") throw new Error(msg);
};
