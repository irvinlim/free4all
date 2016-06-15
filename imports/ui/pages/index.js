import { Meteor } from 'meteor/meteor';
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/header/header';
import LeafletMap from '../components/map/leaflet-map';

import MapInfoBox from '../components/map/map-info-box';
import MapNearbyBox from '../components/map/map-nearby-box';

import { GoToGeolocationButton } from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button'

export class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Properties
      gaSelected: null,
      infoBoxState: 0,
      nearbyBoxState: 1,
      mapCenter: { lat: 0, lng: 0 },
      geolocation: { lat: 0, lng: 0 },
    };
  }

  selectGa(gaId) {
    this.setState({
      gaSelected: gaId,
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

  componentWillMount() {
    const self = this;
    Tracker.autorun(function () {
      // Re-subscribe every minute
      Meteor.subscribe('giveaways-current-upcoming', Chronos.currentTime(Meteor.settings.public.refresh_interval || 60000));
    });

    Tracker.autorun(function () {
      // Get reactive geolocation
      const latlng = Geolocation.latLng();
      self.setState({ geolocation: latlng });

      // Set initial map center, if empty
      if (!self.state.mapCenter || !self.state.mapCenter.lat || !self.state.mapCenter.lng)
        self.setState({ mapCenter: latlng });
    });
  }

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={ getMuiTheme() }>
        <div id="main">
          <Header />
          <div className="full-container">
            <LeafletMap
              infoBoxState={ this.state.infoBoxState }
              mapCenter={ this.state.mapCenter }
              geolocation={ this.state.geolocation }
              markerOnClick={ gaId => this.selectGa(gaId) }
              setMapCenter={ mapCenter => this.setState({ mapCenter: mapCenter }) }
            />

            <div id="map-boxes-container">
              <MapInfoBox gaId={ this.state.gaSelected } boxState={ this.state.infoBoxState } setBoxState={ this.setInfoBoxState.bind(this) } />
              <MapNearbyBox gaId={ this.state.gaSelected } boxState={ this.state.nearbyBoxState } setBoxState={ this.setNearbyBoxState.bind(this) } />
            </div>

            <div id="map-floating-buttons">
              <GoToGeolocationButton geolocationOnClick={ this.goToGeolocation.bind(this) } />
              <InsertBtnDialog />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Index.propTypes = {
  name: React.PropTypes.string,
};
