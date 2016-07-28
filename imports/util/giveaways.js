import React from 'react';
import { Meteor } from 'meteor/meteor';

import { Giveaways } from '../api/giveaways/giveaways';
import { ParentCategories } from '../api/parent-categories/parent-categories';
import { Categories } from '../api/categories/categories';
import { StatusTypes } from '../api/status-types/status-types';
import { GiveawayComments } from '../api/giveaway-comments/giveaway-comments';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from './helper';
import * as IconsHelper from './icons';
import * as AvatarHelper from './avatar';

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
export const getSortedStatusUpdates = (ga) => {
  return ga.statusUpdates.sort((a,b) => b.date - a.date);
};

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

export const countTotalStatusUpdates = (ga) => ga.statusUpdates ? ga.statusUpdates.length : 0;

// Ratings
export const countUpvotes = (ga) => ga.ratings && ga.ratings.upvotes ? ga.ratings.upvotes.length : 0;
export const countDownvotes = (ga) => ga.ratings && ga.ratings.downvotes ? ga.ratings.downvotes.length : 0;
export const countTotalVotes = (ga) => ga.ratings ? (ga.ratings.upvotes ? ga.ratings.upvotes.length : 0) + (ga.ratings.downvotes ? ga.ratings.downvotes.length : 0) : 0;
export const currentUserUpvoted = (ga) => ga.ratings && ga.ratings.upvotes ? ga.ratings.upvotes.filter(rating => rating.userId == Meteor.userId()).length > 0 : false;
export const currentUserDownvoted = (ga) => ga.ratings && ga.ratings.downvotes ? ga.ratings.downvotes.filter(rating => rating.userId == Meteor.userId()).length > 0 : false;

// User Ratings
export const getRatingPercentageForUser = (user) => {
  const userId = user._id ? user._id : user;
  let totalUpvotes = 0, totalDownvotes = 0;
  Giveaways.find({ userId: userId }).forEach(ga => {
    totalUpvotes += countUpvotes(ga);
    totalDownvotes += countDownvotes(ga);
  });

  if (totalUpvotes + totalDownvotes > 0)
    return (( totalUpvotes / (totalUpvotes + totalDownvotes) ) * 100).toFixed(0);
  else
    return 0;
};

// Dates
export const is_ongoing = (ga) => Helper.is_ongoing(ga.startDateTime, ga.endDateTime);
export const is_havent_start = (ga) => Helper.is_havent_start(ga.startDateTime, ga.endDateTime);
export const is_over = (ga) => Helper.is_over(ga.startDateTime, ga.endDateTime);
export const is_same_date = (ga) => moment(ga.startDateTime).format('D MMM YYYY') == moment(ga.endDateTime).format('D MMM YYYY');

export const dateRange = (ga) => {
  startDate = moment(ga.startDateTime).format("D MMM YYYY");
  endDate = moment(ga.endDateTime).format("D MMM YYYY");
  startTime = moment(ga.startDateTime).format("hh:mm A");
  endTime = moment(ga.endDateTime).format("hh:mm A");

  if (is_same_date(ga))
    return startDate + ", " + startTime + " - " + endTime;
  else
    return startDate + " " + startTime + " - " + endDate + " " + endTime;
};

export const compactDateRange = (ga) => {
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

  start = moment(ga.startDateTime);
  end = moment(ga.endDateTime);
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
};

// Text
export const description = (ga) => ga.description.length ? Helper.nl2br(ga.description) : null;
export const descriptionFirstLine = (ga) => ga.description ? ga.description.split("\n")[0] : "";
export const descriptionTruncate = (ga) => {

  // No description.
  if (!ga.description || !ga.description.length)
    return "";

  // No need to truncate.
  if (ga.description.length <= 160)
    return ga.description;

  const firstWords = ga.description.substr(0, 160).split(" ");
  firstWords.pop();

  return firstWords.join(" ") + " ...";
};

// Avatar
export const makeAvatar = (ga, size=64, style={}) => {
  if (!ga)
    return null;

  if (ga.avatarId)
    return (
      <div className="photo-avatar">
        { AvatarHelper.getImage(ga.avatarId, size) }
      </div>
    );

  else
    return (
      <div className="icon-avatar" style={{ backgroundColor: getStatusColor(ga) }}>
        <span>{ getCategoryIcon(ga, { color: Colors.grey50 }) }</span>
      </div>
    );
};

// Flags
export const userHasFlagged = (ga, user) => {
  const userId = user && user._id ? user._id : user;
  return userId && ga.flags ? ga.flags.some(flag => flag.userId == userId) : false;
};
export const countTotalFlags = (ga) => ga.flags ? ga.flags.length : 0;

// Comments
export const commentBody = (content) => content.length ? Helper.nl2br(content) : null;
export const userHasFlaggedComment = userHasFlagged;
export const countTotalComments = (ga) => GiveawayComments.find({ giveawayId: ga._id }).count();
