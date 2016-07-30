import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Grid } from 'react-bootstrap';
import GiveawayComponent from '../containers/giveaways/giveaway';

export class Giveaway extends React.Component {
  render() {
    return (
      <div id="page-giveaway-single" className="page-container">
        <Grid>
          <GiveawayComponent gaId={ this.props.params.id } />
        </Grid>
      </div>
    );
  }
}
