import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';

import MapInfoBoxTop from './map-info-box-top';
import MapInfoBoxBot from './map-info-box-bot';
import MapNearbyBox from './map-nearby-box';

export default class MapSideBars extends React.Component {
  constructor(props) {
    super(props);
  }

  updateBoxClass() {
    if (this.props.infoBoxState == 0) {
      $("#map-info-box").removeClass('show-full peek-at-title');
      $(".map-marker").removeClass("selected");
    } else if (this.props.infoBoxState == 1) {
      $("#map-info-box").removeClass('show-full').addClass('peek-at-title');
    } else if (this.props.infoBoxState == 2) {
      $("#map-info-box").removeClass('peek-at-title').addClass('show-full');
    }
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
  }

  render() {
    this.updateBoxClass();

    return (
      <Grid id="map-boxes-container">
        <Row style={ { height: "100%"} }>
          <Col xs={12} sm={6} md={3} lg={3} className="map-sidebar" id="map-info-box">
            <MapInfoBoxTop ga={ this.props.ga } setStateHandler={ this.props.setStateHandler } />
            <MapInfoBoxBot ga={ this.props.ga } />
            <div className="close-button">
              <FontIcon className="material-icons">close</FontIcon>
            </div>
          </Col>
          <Col xsHidden smHidden md={3} mdOffset={6} lg={3} lgOffset={6} className="map-sidebar" id="map-nearby-box">
            <MapNearbyBox ga={ this.props.ga } />
          </Col>
        </Row>
      </Grid>
    );
  }
}
