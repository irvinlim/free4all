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
    primaryText={
      <span className="single-line" style={{ color: Colors.grey700 }}>{ ga.title }</span>
    }
    secondaryText={
      <span>{ GiveawaysHelper.compactDateRange(ga) }<br/>{ ga.location }</span>
    }
    leftAvatar={ GiveawaysHelper.makeAvatar(ga, 40) }
    secondaryTextLines={2}
    onTouchTap={ touchTapHandler(ga) }
  />
);

export const NearbyGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"20px 0px 10px" }}>Nearby Giveaways</h3>
    </Subheader>
    { props.giveaways ? Helper.insertDividers(props.giveaways.map(giveawayRow(props.nearbyOnClick))) : <div /> }
  </List>
);
