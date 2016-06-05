import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';

import MapInfoBoxTop from './map-info-box-top';
import MapInfoBoxBot from './map-info-box-bot';
import MapNearbyBox from './map-nearby-box';

export default class MapSideBars extends React.Component {
  constructor(props) {
    super(props);
  }

  positionBoxes() {
    $(window).resize(function() {
      $("#map-nearby-box").css('left', window.innerWidth - $("#map-nearby-box").outerWidth());

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
      self.props.setInfoBoxState(2);
    });

    $("#map-info-box .close-button").click(event => {
      event.stopPropagation();

      if (self.props.infoBoxState == 1)
        self.props.setInfoBoxState(0);
      else if (self.props.infoBoxState == 2)
        self.props.setInfoBoxState(1);
    });

    $(".expand-button-infobox").click(event => {
      event.stopPropagation();

      if (self.props.infoBoxState == 0)
        self.props.setInfoBoxState(2);
      else
        self.props.setInfoBoxState(0);
    });

    $(".expand-button-nearbybox").click(event => {
      event.stopPropagation();

      if (self.props.nearbyBoxState == 0)
        self.props.setNearbyBoxState(2);
      else
        self.props.setNearbyBoxState(0);
    });

    this.positionBoxes();
  }

  render() {
    return (
      <div>
        <Grid id="map-boxes-container">
          <Row style={ { height: "100%"} }>

            <Col xs={12} sm={6} md={3} lg={3} className={ "map-sidebar state-" + this.props.infoBoxState } id="map-info-box">
              <Scrollbars autoHide style={{ height: "100%",  }}>
                <MapInfoBoxTop ga={ this.props.ga } />
                <MapInfoBoxBot ga={ this.props.ga } />
              </Scrollbars>

              <div className="close-button hidden-sm hidden-md hidden-lg">
                <FontIcon className="material-icons">close</FontIcon>
              </div>

              <div className="expand-button-infobox hidden-xs">
                <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
                  <FontIcon className="material-icons">{ this.props.infoBoxState == 0 ? "keyboard_arrow_right" : "keyboard_arrow_left" }</FontIcon>
                </FloatingActionButton>
              </div>
            </Col>

            <Col xsHidden smHidden md={3} lg={3} className={ "map-sidebar state-" + this.props.nearbyBoxState } id="map-nearby-box">
              <Scrollbars>
                <MapNearbyBox ga={ this.props.ga } />
              </Scrollbars>

              <div className="expand-button-nearbybox hidden-xs hidden-sm">
                <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
                  <FontIcon className="material-icons">{ this.props.nearbyBoxState == 0 ? "keyboard_arrow_left" : "keyboard_arrow_right" }</FontIcon>
                </FloatingActionButton>
              </div>
            </Col>

          </Row>
        </Grid>
      </div>
    );
  }
}
