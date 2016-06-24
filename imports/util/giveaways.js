import React from 'react';
import * as Helper from './helper';
import * as IconsHelper from './icons';

import { Categories } from '../api/categories/categories';
import { StatusTypes } from '../api/status-types/status-types';
import { StatusUpdates } from '../api/status-updates/status-updates';

export const getCategory = (ga) => Categories.findOne(ga.categoryId);

export const getCategoryIconClass = (ga) => {
  const cat = getCategory(ga);
  return cat ? cat.iconClass : null;
};

export const getCategoryIcon = (ga) => IconsHelper.catIcon(getCategory(ga));

export const getStatusColor = (ga) => {
  const status = StatusUpdates.findOne({ userId: ga.userId, giveawayId: ga._id }, { sort: { date: "desc" } });
  if (!status) return null;
  const statusType = StatusTypes.findOne(status.statusTypeId);
  if (!statusType) return null;

  return Helper.sanitizeHexColour(statusType.hexColour);
};
