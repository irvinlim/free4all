import React from 'react';
import Chip from 'material-ui/Chip';

import * as Colors from 'material-ui/styles/colors';
import * as IconsHelper from '../../../util/icons';
import * as UsersHelper from '../../../util/users';

const makeChip = (role) => {
  let icon, label;

  if (role == "moderator") {
    icon = "gavel";
    label = "Mod";
  } else if (role == "admin") {
    icon = "android";
    label = "Admin";
  } else {
    return null;
  }

  return (
    <Chip backgroundColor="#8595b7" labelStyle={{ fontSize: 12, textTransform: 'uppercase', color: "#fff", lineHeight: "24px", padding: "0 8px" }}>
      { label }
    </Chip>
  );
};

export const ProfileHeader = ({ user, shareCount, ratingPercent, homeCommunity }) => (
  <div className="profile-header flex-row">
    <div className="col-xs-4 col-sm-2">
      { UsersHelper.getAvatar(user, 240, { width: "100%", height: 'auto' }) }
    </div>
    <div className="col-xs-8 col-sm-10">
      <h1>{ UsersHelper.getFullName(user) } <span className="role-chips">{ user.roles.map(makeChip) }</span></h1>
      { homeCommunity ? <h5>{ homeCommunity.name }</h5> : null }
      <p style={{ color: Colors.grey600 }}>{ UsersHelper.getBio(user) }</p>
      <ul className="user-stats">
        <li><strong>{ shareCount }</strong> giveaways shared</li>
        <li><strong>{ ratingPercent }%</strong> approval rating</li>
      </ul>
    </div>
  </div>
);
