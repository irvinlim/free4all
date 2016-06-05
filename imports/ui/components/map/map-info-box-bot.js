import React from 'react';
import GiveawayRatings from '../../containers/giveaways/giveaway-ratings';

export default class MapInfoBoxBot extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let renderContent = null;
    const ga = this.props.ga;

    if (ga) {
      renderContent = (
        <div>
          <h3>User Reviews</h3>
          <GiveawayRatings ga={ this.props.ga } />
        </div>
      );
    }

    return (
      <div className="map-sidebar-box" id="info-box-bot">
        { renderContent }
      </div>
    );
  }
}
