import React from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

import * as Helper from '../../../modules/helper';
import * as Colors from 'material-ui/styles/colors';

const giveawayRow = (ga) => (
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
    onTouchTap={ () => browserHistory.push("/giveaway/" + ga._id) }
  />
);

export const NearbyGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"10px 0" }}>Nearby Giveaways</h3>
    </Subheader>
    { Helper.insertDividers(props.giveaways.map(giveawayRow)) }
  </List>
);
