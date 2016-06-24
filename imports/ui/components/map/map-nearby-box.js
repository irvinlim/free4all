import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Scrollbars } from 'react-custom-scrollbars';

import NearbyGiveaways from '../../containers/giveaways/nearby-giveaways';

import * as IconsHelper from '../../../util/icons';

export default class MapNearbyBox extends React.Component {
  positionBoxes() {
    $(window).resize(function() {
      $("#map-nearby-box").css('left', window.innerWidth - $("#map-nearby-box").outerWidth());
    });
    $(window).resize();
  }

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
  }

  render() {
    return (
      <div id="map-nearby-box" className={ "map-sidebar hidden-xs hidden-sm col-md-3 col-lg-3 state-" + this.props.boxState }>
        <Scrollbars autoHide style={{ height: "100%" }}>
          <NearbyGiveaways mapBounds={ this.props.mapBounds } nearbyOnClick={ this.props.nearbyOnClick } />
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
