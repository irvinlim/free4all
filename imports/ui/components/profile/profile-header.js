import React from 'react';
import Chip from 'material-ui/Chip';
import Link from '../../layouts/link';

import * as Colors from 'material-ui/styles/colors';
import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';

const makeChip = (role, index) => {
  let label;

  if (role == "moderator") {
    label = "Mod";
  } else if (role == "admin") {
    label = "Admin";
  } else {
    return null;
  }

  return (
    <Chip key={index} backgroundColor="#8595b7" labelStyle={{ fontSize: 12, textTransform: 'uppercase', color: "#fff", lineHeight: "24px", padding: "0 8px" }}>
      { label }
    </Chip>
  );
};

const makeUrlIcon = (icon, url) => (
  <Link className="social-link" to={url} style={{ margin: "0 5px" }}>
    { IconsHelper.icon(icon) }
  </Link>
);

export const ProfileHeader = ({ user, shareCount, ratingPercent, homeCommunity }) => (
  <div className="profile-header flex-row">
    <div className="col-xs-4 col-sm-2">
      { UsersHelper.getAvatar(user, 240, { width: "100%", height: 'auto' }) }
    </div>
    <div className="col-xs-8 col-sm-10">
      <h1>{ UsersHelper.getFullName(user) } <span className="role-chips">{ user.roles.map(makeChip) }</span></h1>
      { homeCommunity ? <h5>{ homeCommunity.name }</h5> : null }

      <div className="social-links">
        { user.profile.website ? makeUrlIcon('fa fa-link', user.profile.website) : null }
        { user.profile.facebookId ? makeUrlIcon('fa fa-facebook-f', `https://facebook.com/${user.profile.facebookId}`) : null }
        { user.profile.twitterId ? makeUrlIcon('fa fa-twitter', `https://twitter.com/${user.profile.twitterId}`) : null }
        { user.profile.instagramId ? makeUrlIcon('fa fa-instagram', `https://www.instagram.com/${user.profile.instagramId}`) : null }
        { user.profile.googlePlusId ? makeUrlIcon('fa fa-google-plus', `https://plus.google.com/+${user.profile.googlePlusId}`) : null }
      </div>

      <p style={{ color: Colors.grey600 }}>{ UsersHelper.getBio(user) }</p>
      <ul className="user-stats">
        <li><strong>{ shareCount }</strong> giveaways shared</li>
        <li><strong>{ ratingPercent }%</strong> approval rating</li>
      </ul>
    </div>
  </div>
);
