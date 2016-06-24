import React from 'react';
import { Meteor } from 'meteor/meteor';

import { ParentCategories } from '../api/parent-categories/parent-categories';
import { Categories } from '../api/categories/categories';
import { StatusTypes } from '../api/status-types/status-types';

import * as Helper from './helper';
import * as IconsHelper from './icons';

// Category
export const getCategory = (ga) => Categories.findOne(ga.categoryId);
export const getParentCategory = (ga) => ParentCategories.findOne(getCategory(ga).parent);

export const getCategoryIconClass = (ga) => {
  const cat = getCategory(ga);
  return cat ? cat.iconClass : null;
};

export const getCategoryIcon = (ga, style={}) => IconsHelper.catIcon(getCategory(ga), style);
export const categoryBreadcrumbs = (ga) => getParentCategory(ga).name + " — " + getCategory(ga).name;

// Statuses
export const getLastOwnerStatus = (ga) => {
  const ownerStatuses = ga.statusUpdates.filter(su => su.userId == ga.userId);
  if (!ownerStatuses.length) return null;
  return ownerStatuses.reduce((p,x) => x.date > p.date ? x : p);
};

export const getLastOwnerStatusType = (ga) => {
  const lastOwnerStatus = getLastOwnerStatus(ga);
  if (!lastOwnerStatus) return null;
  return StatusTypes.findOne(lastOwnerStatus.statusTypeId);
}

export const getStatusColor = (ga) => {
  const lastOwnerStatusType = getLastOwnerStatusType(ga);
  if (!lastOwnerStatusType) return null;
  return Helper.sanitizeHexColour(lastOwnerStatusType.hexColour);
};

// Ratings
export const countUpvotes = (ga) => ga.ratings ? ga.ratings.reduce((sum, rating) => rating.isUpvote ? sum + 1 : sum, 0) : 0;
export const countDownvotes = (ga) => ga.ratings ? ga.ratings.reduce((sum, rating) => !rating.isUpvote ? sum + 1 : sum, 0) : 0;
export const getCurrentUserVote = (ga) => {
  if (!Meteor.userId() || !ga.ratings)
    return null;

  const ownVotes = ga.ratings.filter(rating => Meteor.userId() == rating.userId);
  return ownVotes.length ? ownVotes[0] : null;
};
export const currentUserUpvoted = (ga) => {
  const currentUserVote = getCurrentUserVote(ga);
  return currentUserVote && currentUserVote.isUpvote === true;
};
export const currentUserDownvoted = (ga) => {
  const currentUserVote = getCurrentUserVote(ga);
  return currentUserVote && currentUserVote.isUpvote === false;
};

// Dates
export const is_ongoing = (ga) => Helper.is_ongoing(ga.startDateTime, ga.endDateTime);
export const is_havent_start = (ga) => Helper.is_havent_start(ga.startDateTime, ga.endDateTime);
export const is_over = (ga) => Helper.is_over(ga.startDateTime, ga.endDateTime);

export const compactDateRange = (start, end) => {
  moment.updateLocale('en', {
    calendar: {
      lastDay : '[yesterday at] LT',
      sameDay : '[today at] LT',
      nextDay : '[tomorrow at] LT',
      lastWeek : '[last] dddd [at] LT',
      nextWeek : '[on] dddd [at] LT',
      sameElse : '[on] LL'
    }
  });

  start = moment(start);
  end = moment(end);
  now = moment();

  if (start.isAfter(now)) {
    // Haven't start
    return "Starting " + start.calendar(now);
  } else if (end.isBefore(now)) {
    // Already ended
    return "Ended " + end.calendar(now);
  } else {
    // Ongoing
    return "Ending " + end.calendar();
  }
}

// Text
export const description = (ga) => ga.description.length ? Helper.nl2br(ga.description) : <em>No description</em>;
