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
      gaSelected: null,   // Giveaway selected
      infoBoxState: 0,
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
    this.setState({ gaSelected: ga });
    this.setState({ infoBoxState: 1 });
  }

  setInfoBoxState(x) {
    this.setState({ infoBoxState: x });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div id="main">
          <AppNavigation />
          <div className="full-container">
            <LeafletMap clickHandler={ this.selectGa.bind(this) } />
            <MapSideBars ga={ this.state.gaSelected } infoBoxState={ this.state.infoBoxState } setStateHandler={ this.setInfoBoxState.bind(this) } />
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
