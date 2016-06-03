import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppNavigation from '../components/menu/app-navigation';
import LeafletMap from '../components/map/leaflet-map';
import MapInfoBox from '../components/map/map-info-box';
import MapNearbyBox from '../components/map/map-nearby-box';
import InsertBtnDialog from '../components/map/insert-button'

export class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gaSelected: null,   // Giveaway selected
    };
  }

  selectGa(ga) {
    this.setState({ gaSelected: ga });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div id="main">
          <AppNavigation />
          <div className="full-container">
            <LeafletMap onSelectGa={ this.selectGa.bind(this) } />
            <MapInfoBox ga={ this.state.gaSelected } />
            <InsertBtnDialog />
            <MapNearbyBox />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  componentDidMount() {
    // Resize full-container to adjust for navigation bar
    $(window).resize(function() {
      $('.full-container').css('height', window.innerHeight - $("#app-navigation").outerHeight());
    });

    $(window).resize();
  }
}

Index.propTypes = {
  name: React.PropTypes.string,
};
