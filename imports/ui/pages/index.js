import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppNavigation from '../components/menu/app-navigation';
import LeafletMap from '../components/map/leaflet-map';
import MapInfoBox from '../components/map/map-info-box';
import MapNearbyBox from '../components/map/map-nearby-box';

import { StatusTypes } from "../../modules/status-types.js";

export class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gaSelected: null,   // Giveaway selected
    };
  }

  getGa(gaId) {
    // Temp
    return {
      id:             gaId,
      title:          "NUSSU Welfare Ice Cream Giveaway",
      description:    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus efficitur semper ligula vitae finibus. Nam cursus scelerisque tincidunt.",
      photoURL:       "http://placehold.it/64",
      momentStart:    moment().subtract(1, 'd'),
      momentEnd:      moment().add(1, 'd'),
      location:       "Central Library",
      coordinates:    [ 1.2967193, 103.7710143 ],
      cat:            [
        { _id: "ice-cream", name: "Ice Cream" }
      ],
      tags:           [ "nussu", "ice-cream" ],
      statuses:       [ // Supposed to be a chronological list of status updates
        { status: StatusTypes.Available, moment: moment() },
      ],
    }
  }

  selectGa(gaId) {
    const ga = this.getGa(gaId);
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
