import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Scrollbars } from 'react-custom-scrollbars';
import * as Helper from '../../../modules/helper';

import GiveawayInfoboxContent from '../../containers/giveaways/giveaway-infobox-content';
import GiveawayRatings from '../../containers/giveaways/giveaway-ratings';

export default class MapInfoBox extends React.Component {

  positionBoxes() {
    $(window).resize(function() {
      if (window.innerWidth >= 768)
        $("#map-info-box").css('right', window.innerWidth - $("#map-info-box").outerWidth());
      else
        $("#map-info-box").css('right', "");
    });
    $(window).resize();
  }

  componentDidMount() {
    const self = this;
    $("#map-info-box").click(event => {
      self.props.setBoxState(2);
    });

    $("#map-info-box .close-button").click(event => {
      event.stopPropagation();

      if (self.props.boxState == 1)
        self.props.setBoxState(0);
      else if (self.props.boxState == 2)
        self.props.setBoxState(1);
    });

    $(".expand-button-infobox").click(event => {
      event.stopPropagation();

      if (self.props.boxState == 0 && this.props.gaId)
        self.props.setBoxState(2);
      else
        self.props.setBoxState(0);
    });

    this.positionBoxes();
  }

  render() {
    return (
      <div id="map-info-box" className={ "map-sidebar col-xs-12 col-sm-6 col-md-3 col-lg-3 state-" + this.props.boxState }>
        <Scrollbars autoHide style={{ height: "100%",  }}>
          <div className="map-sidebar-box" id="info-box-top">
            <GiveawayInfoboxContent gaId={ this.props.gaId } />
          </div>

          <div className="map-sidebar-box" id="info-box-bot">
            <h3>User Reviews</h3>
            <GiveawayRatings gaId={ this.props.gaId } />
          </div>
        </Scrollbars>

        <div className="close-button hidden-sm hidden-md hidden-lg">
          <FontIcon className="material-icons">close</FontIcon>
        </div>

        <div className="expand-button-infobox hidden-xs">
          <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
            <FontIcon className="material-icons">{ this.props.boxState == 0 ? "keyboard_arrow_right" : "keyboard_arrow_left" }</FontIcon>
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

