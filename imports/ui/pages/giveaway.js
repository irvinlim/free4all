import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';
import GiveawaySingleCard from '../containers/giveaways/giveaway-single-card';
import GiveawayRatingsCard from '../containers/giveaways/giveaway-ratings-card';
import GiveawayMetaCard from '../containers/giveaways/giveaway-meta-card';

export class Giveaway extends React.Component {
  render() {
    return (
      <div id="giveaway-single">
        <Grid style={{ marginTop: 20 }}>
          <Row>
            <Col xs={12}>
              <GiveawaySingleCard gaId={ this.props.params.id } />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} md={4}>
              <GiveawayRatingsCard gaId={ this.props.params.id } />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <GiveawayMetaCard gaId={ this.props.params.id } />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
