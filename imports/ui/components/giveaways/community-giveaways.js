import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { joinCommunity, leaveCommunity, setHomeCommunity } from '../../../api/users/methods'

import * as Helper from '../../../util/helper';
import * as AvatarHelper from '../../../util/avatar';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as Colors from 'material-ui/styles/colors';
import * as IconsHelper from '../../../util/icons';

const joinCommunityHandler = (payload) => {
  joinCommunity.call(payload);
}
const leaveCommunityHandler = (payload) => {
  leaveCommunity.call(payload);
}

const setHomeCommHandler = (payload) => {
  setHomeCommunity.call(payload);
}

const giveawayRow = (touchTapHandler, editGa) => (ga) => (
  <ListItem
    key={ ga._id }
    primaryText={
      <span className="single-line" style={{ color: Colors.grey700 }}>{ ga.title }</span>
    }
    secondaryText={
      <p>
        <span className="location">Starting on: { moment(ga.startDateTime).format("ddd, Do MMM, h:mm a")}</span>
        <br />
        <span className="location">Ending on: { moment(ga.endDateTime).format("ddd, Do MMM, h:mm a")}</span>
      </p>
    }
    leftAvatar={
      ga.avatarId ? <Avatar src={ AvatarHelper.getUrl(ga.avatarId, 64) } />
      : <Avatar icon={ GiveawaysHelper.getCategoryIcon(ga) } backgroundColor={ GiveawaysHelper.getStatusColor(ga) } />
    }

    secondaryTextLines={2}
    onTouchTap={ touchTapHandler(ga) }

  />
);

export const CommunityGiveaways = (props) => (
  <List>
    <Subheader>
      <h3 style={{ margin:"20px 0px 0px" }}>{props.community.name}</h3>
      <Row>
        <Col xs={12}>
          <div>{ props.community.description }</div>
          <div style={{marginTop:"-30px"}}>
            { props.community.count + ' ' + Helper.pluralizer(props.community.count,"member", "members")} 
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={5} style={{padding: "0 0 0 15px"}}>
        { props.user ?
           props.user.homeCommunityId && props.user.homeCommunityId == props.community._id ?
           <FlatButton
             label="Home"
             icon={ IconsHelper.materialIcon("home") } />
           :
           <RaisedButton 
             style={{height: "48px"}}
             onTouchTap={ setHomeCommHandler.bind(this, { userId: props.user._id, community: props.community }) }
             primary={true}
             label="Set Home"
             icon={ IconsHelper.materialIcon("home") } />
          :
          <div>
            <IconButton
              tooltip="Register to save home community!"
              tooltipPosition="bottom-right"
              style={{ zIndex: 1, position: "absolute", width:"75%" }} />
            <RaisedButton 
              style={{height: "48px"}}
              label="Set home" 
              disabled={true} />
          </div>

        }
        </Col>
        <Col xs={7}>
        { props.user ?
           props.user.communityIds && props.user.communityIds.indexOf(props.community._id) > -1 ?
            <FlatButton 
              onTouchTap={ leaveCommunityHandler.bind(this, { userId: props.user._id, commId: props.community._id} )}
              label="Leave Community" 
              className="leaveComm" />
            :
            <RaisedButton 
              onTouchTap={ joinCommunityHandler.bind(this, { userId: props.user._id, commId: props.community._id} )}
              style={{height: "48px"}} 
              label="Join Community" 
              className="joinComm" 
              primary={true} />
          :
          <div>
            <IconButton
              tooltip="Register to join community!"
              tooltipPosition="bottom-right"
              style={{ zIndex: 1, position: "absolute", width:"75%" }} />
            <RaisedButton 
              style={{height: "48px"}}
              label="Join Community" 
              disabled={true} />
          </div>
        }
        </Col>
      </Row>
      <hr />
      <h3 style={{ margin:"20px 0px 10px" }}>{props.community.name} Giveaways</h3>

      { props.showDateRange ? 
      <div>
        <Row>
          <Col xs={12} md={2}>
          <span>From</span>
          </Col>
          <Col xs={12} md={2}>
          <DatePicker
          value={ props.userFromDate }
          onChange={ props.handleUserFromDate }
          formatDate={ props.formatDate }
          textFieldStyle={ {width:"105px", fontSize:"14px"}}
          id="community-fromDate"
          />
          </Col>
        </Row>

        <Row style={{paddingBottom:"10px"}}>
          <Col xs={12} md={2}>
          <span>Until</span>
          </Col>
          <Col xs={12} md={2}>
          <DatePicker
          value={ props.userUntilDate }
          onChange={ props.handleUserUntilDate }
          formatDate={ props.formatDate }
          textFieldStyle={ {width:"105px", fontSize:"14px"}}
          id="community-untilDate"
          />
          </Col>
        </Row>
      </div>
      :
      <div />
      }

      <Row>
        <Col xs={12} md={6}>
        <Toggle
        labelStyle= {{fontWeight:200}}
        label="All giveaways"
        onToggle={ props.handleAllUserGiveaways }
        />
        </Col>
      </Row>

  
    </Subheader>
    { props.giveaways 
      ? Helper.insertDividers(props.giveaways.map(giveawayRow(props.nearbyOnClick, props.editGa) )) 
      : <div /> 
    }
  </List>
);
