import { Meteor } from 'meteor/meteor';
import React from 'react';
import GiveawayComponent from '../containers/giveaways/giveaway';

export class Giveaway extends React.Component {
  render() {
    return (
      <div id="page-giveaway-single" className="page-container">
        <div className="container">
          <GiveawayComponent gaId={ this.props.params.id } />
        </div>
      </div>
    );
  }
}
