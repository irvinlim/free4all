import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import MapInfoBoxTop from './map-info-box-top';
import MapInfoBoxBot from './map-info-box-bot';
import MapNearbyBox from './map-nearby-box';

export default class MapSideBars extends React.Component {
  constructor(props) {
    super(props);
  }

  updateBoxClass() {
    if (this.props.infoBoxState == 0)
      $("#map-info-box").removeClass('show-full peek-at-title');
    else if (this.props.infoBoxState == 1)
      $("#map-info-box").removeClass('show-full').addClass('peek-at-title');
    else if (this.props.infoBoxState == 2)
      $("#map-info-box").removeClass('peek-at-title').addClass('show-full');
  }

  componentDidMount() {
    const setStateHandler = this.props.setStateHandler;
    $("#map-info-box").click(event => setStateHandler(2));
  }

  render() {
    this.updateBoxClass();

    return (
      <Grid id="map-boxes-container">
        <Row style={ { height: "100%"} }>
          <Col xs={12} sm={6} md={3} lg={3} className="map-sidebar" id="map-info-box">
            <MapInfoBoxTop ga={ this.props.ga } setStateHandler={ this.props.setStateHandler } />
            <MapInfoBoxBot ga={ this.props.ga } />
          </Col>
          <Col xsHidden smHidden md={3} mdOffset={6} lg={3} lgOffset={6} className="map-sidebar" id="map-nearby-box">
            <MapNearbyBox ga={ this.props.ga } />
          </Col>
        </Row>
      </Grid>
    );
  }
}
