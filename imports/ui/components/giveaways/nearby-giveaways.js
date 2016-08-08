import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import * as Helper from '../../../util/helper';
import * as AvatarHelper from '../../../util/avatar';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as Colors from 'material-ui/styles/colors';

const giveawayRow = (touchTapHandler) => (ga) => (
  <ListItem
    key={ ga._id }
    primaryText={ga.title}
    secondaryText={
      <p>{ GiveawaysHelper.compactDateRange(ga) }<br/>{ ga.location }</p>
    }
    leftAvatar={ GiveawaysHelper.makeAvatar(ga, 40) }
    secondaryTextLines={3}
    onTouchTap={ touchTapHandler(ga) }
  />
);

export const NearbyGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"20px 0px 10px" }}>Available Giveaways</h3>
      <h5 style={{ margin: "10px 0 20px", color: "#6d6d6d" }}>Only ongoing giveaways (up to 1 week in the future) from your communities are displayed here.</h5>
    </Subheader>
    <Divider />
    { props.giveaways ? Helper.insertDividers(props.giveaways.map(giveawayRow(props.nearbyOnClick))) : <div /> }
  </List>
);
