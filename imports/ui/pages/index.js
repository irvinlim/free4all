import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppNavigation from '../components/menu/app-navigation';
import LeafletMap from '../components/map/leaflet-map';
import MapSideBars from '../components/map/map-sidebars';
import InsertBtnDialog from '../components/map/insert-button'

export class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gaSelected: null,
      infoBoxState: 0,
      nearbyBoxState: 0,
    };
  }

  componentWillMount() {
    this.subscriptions = [
      Meteor.subscribe('parent-categories'),
      Meteor.subscribe('categories'),
      Meteor.subscribe('status-types'),
      Meteor.subscribe('giveaways'),
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.stop());
  }

  selectGa(ga) {
    this.setState({ 
      gaSelected: ga, 
      infoBoxState: 1,  // Bottom bar: peek title / Sidebar: show 
    });
  }

  setInfoBoxState(x) {
    this.setState({ infoBoxState: x });
    if (!x) this.setState({ gaSelected: null });
  }

  setNearbyBoxState(x) {
    this.setState({ nearbyBoxState: x });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div id="main">
          <AppNavigation />
          <div className="full-container">
            <LeafletMap 
              infoBoxState={ this.state.infoBoxState } 
              markerOnClick={ ga => this.selectGa(ga) } 
            />
            <MapSideBars 
              ga={ this.state.gaSelected } 
              infoBoxState={ this.state.infoBoxState } 
              nearbyBoxState={ this.state.nearbyBoxState } 
              setInfoBoxState={ this.setInfoBoxState.bind(this) } 
              setNearbyBoxState={ this.setNearbyBoxState.bind(this) } 
            />
            <InsertBtnDialog />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Index.propTypes = {
  name: React.PropTypes.string,
};
