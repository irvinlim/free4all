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

  updateBoxClass() {
    if (this.props.infoBoxState == 1) {
      $("#map-info-box").removeClass('state-2').addClass('state-1');
    } else if (this.props.infoBoxState == 2) {
      $("#map-info-box").removeClass('state-1').addClass('state-2');
    } else {
      $("#map-info-box").removeClass('state-2 state-1');
      $(".map-marker").removeClass("selected");
    }
  }

  positionInfoBox() {
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
      self.props.setStateHandler(2);
    });

    $("#map-info-box .close-button").click(event => {
      event.stopPropagation();

      if (self.props.infoBoxState == 1)
        self.props.setStateHandler(0);
      else if (self.props.infoBoxState == 2)
        self.props.setStateHandler(1);
    });

    $("#map-info-box .expand-button").click(event => {
      event.stopPropagation();

      if (self.props.infoBoxState == 2)
        self.props.setStateHandler(1);
      else
        self.props.setStateHandler(2);
    });

    this.positionInfoBox();
  }

  render() {
    this.updateBoxClass();

    return (
      <div>
        <Grid id="map-boxes-container">
          <Row style={ { height: "100%"} }>
            <Col xs={12} sm={6} md={3} lg={3} className="map-sidebar" id="map-info-box">
              <Scrollbars autoHide style={{ height: "100%",  }}>
                <MapInfoBoxTop ga={ this.props.ga } setStateHandler={ this.props.setStateHandler } />
                <MapInfoBoxBot ga={ this.props.ga } />
              </Scrollbars>
              <div className="close-button">
                <FontIcon className="material-icons">close</FontIcon>
              </div>
              <div className="expand-button">
                <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
                  <FontIcon className="material-icons">{ this.props.infoBoxState == 2 ? "keyboard_arrow_right" : "keyboard_arrow_left" }</FontIcon>
                </FloatingActionButton>
              </div>
            </Col>
            <Col xsHidden smHidden md={3} mdOffset={6} lg={3} lgOffset={6} className="map-sidebar" id="map-nearby-box">
              <Scrollbars>
                <MapNearbyBox ga={ this.props.ga } />
              </Scrollbars>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
