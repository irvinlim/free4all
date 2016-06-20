import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import * as Helper from '../../../util/helper';
import * as Colors from 'material-ui/styles/colors';

const giveawayRow = (touchTapHandler) => (ga) => (
  <ListItem
    key={ ga._id }
    primaryText={
      <span style={{ color: Colors.grey700 }}>{ ga.title }</span>
    }
    secondaryText={
      <p>
        <span className="location">{ ga.location }</span>
      </p>
    }
    secondaryTextLines={2}
    onTouchTap={ touchTapHandler(ga) }
  />
);

export const NearbyGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"20px 0px 10px" }}>Nearby Giveaways</h3>
    </Subheader>
    { Helper.insertDividers(props.giveaways.map(giveawayRow(props.nearbyOnClick))) }
  </List>
);
