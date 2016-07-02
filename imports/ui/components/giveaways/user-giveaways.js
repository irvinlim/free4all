import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';

import * as Helper from '../../../util/helper';
import * as AvatarHelper from '../../../util/avatar';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as Colors from 'material-ui/styles/colors';
import * as IconsHelper from '../../../util/icons';

const giveawayRow = (touchTapHandler) => (ga) => (
  <ListItem
    key={ ga._id }
    primaryText={
      <span className="single-line" style={{ color: Colors.grey700 }}>{ ga.title }</span>
    }
    secondaryText={
      <p>
        <span className="location">Added on: { moment(ga.created_at).format("ddd, Do MMM, h:mm a")}</span>
      </p>
    }
    leftAvatar={
      ga.avatarId ? <Avatar src={ AvatarHelper.getUrl(ga.avatarId, 64) } />
                  : <Avatar icon={ GiveawaysHelper.getCategoryIcon(ga) } backgroundColor={ GiveawaysHelper.getStatusColor(ga) } />
    }
    secondaryTextLines={2}
    onTouchTap={ touchTapHandler(ga) }
    rightIconButton={    
      <IconButton tooltip="Edit" style={{top: "9px",right: "12px"}}>
        { IconsHelper.materialIcon("mode_edit", {color:"grey",}) }
      </IconButton>
          }
  />
);

export const UserGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"20px 0px 10px" }}>User's Giveaways</h3>
    </Subheader>
    { props.giveaways ? Helper.insertDividers(props.giveaways.map(giveawayRow(props.nearbyOnClick))) : <div /> }
  </List>
);
