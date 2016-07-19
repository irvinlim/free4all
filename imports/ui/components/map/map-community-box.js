import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Scrollbars } from 'react-custom-scrollbars';

import CommunityGiveaways from '../../containers/giveaways/community-giveaways';

import * as IconsHelper from '../../../util/icons';

export default class MapCommunityBox extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      user: null,
    }

    this.autorunAuth = null;
  }

  positionBoxes() {
    $(window).resize(function() {
      $("#map-nearby-box").css('left', window.innerWidth - $("#map-nearby-box").outerWidth());
    });
    $(window).resize();
  }
  formatDate(date) {
    return moment(date).format("ddd, D MMM YYYY");
  };

  componentDidMount() {
    const self = this;

    $(".expand-button-nearbybox").click(event => {
      event.stopPropagation();

      if (self.props.boxState == 0)
        self.props.setBoxState(2);
      else
        self.props.setBoxState(0);
    });

    this.positionBoxes();

    this.autorunAuth = Tracker.autorun(function(){
      const user = Meteor.user();
      self.setState({ user: user })
    })
  }

  componentWillUnmount(){
    this.autorunAuth && this.autorunAuth.stop();
  }

  render() {
    return (
      <div id="map-nearby-box" className={ "map-sidebar hidden-xs hidden-sm col-md-3 col-lg-3 state-" + this.props.boxState }>
        <Scrollbars autoHide style={{ height: "100%" }}>

          <CommunityGiveaways 
            communityId={ this.props.communityId }
            mapBounds={ this.props.mapBounds } 
            nearbyOnClick={ this.props.nearbyOnClick } 
            userUntilDate={ this.props.userUntilDate }
            handleUserUntilDate={ this.props.handleUserUntilDate }
            userFromDate={ this.props.userFromDate }
            handleUserFromDate={ this.props.handleUserFromDate }
            handleAllUserGiveaways= { this.props.handleAllUserGiveaways }
            formatDate={ this.formatDate.bind(this) }
            isAllGa={ this.props.isAllGa }
            showDateRange={ this.props.showDateRange }
            user={this.state.user} />

        </Scrollbars>

        <div className="expand-button-nearbybox hidden-xs hidden-sm">
          <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
            { IconsHelper.materialIcon(this.props.boxState == 0 ? "keyboard_arrow_left" : "keyboard_arrow_right") }
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}
