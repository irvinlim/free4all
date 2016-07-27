import React from 'react';

import * as Colors from 'material-ui/styles/colors';
import * as UsersHelper from '../../../util/users';

export const ProfileHeader = ({ user, shareCount, homeCommunity }) => (
  <div className="profile-header flex-row">
    <div className="col-xs-4 col-sm-2">
      { UsersHelper.getAvatar(user, 240, { width: "100%", height: 'auto' }) }
    </div>
    <div className="col-xs-8 col-sm-10">
      <h1>{ UsersHelper.getFullName(user) }</h1>
      { homeCommunity ? <h5>{ homeCommunity.name }</h5> : null }
      <p style={{ color: Colors.grey600 }}>{ UsersHelper.getBio(user) }</p>
      <ul className="user-stats">
        <li><strong>{ shareCount }</strong> giveaways shared</li>
      </ul>
    </div>
  </div>
);
