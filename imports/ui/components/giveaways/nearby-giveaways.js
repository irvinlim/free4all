import React from 'react';
import { browserHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
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
    { props.giveaways.map(giveawayRow) }
  </List>
);
