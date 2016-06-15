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

import * as Helper from '../../modules/helper';

export class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Properties
      gaSelected: null,
      infoBoxState: 0,
      nearbyBoxState: 1,
      geolocation: null,
      mapCenter: null,
    };

    this.mapBounds = new ReactiveVar( null );
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
      const reactiveDateTime = Chronos.currentTime(Meteor.settings.public.refresh_interval || 60000);
      const reactiveMapBounds = self.mapBounds.get();

      // Re-subscribe every minute or if map center changed
      if (reactiveDateTime && reactiveMapBounds) {
        Meteor.subscribe('giveaways-on-screen', reactiveDateTime, Helper.mongoBounds(reactiveMapBounds));
      }
    });

    Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();

      // Set initial map center, if not geolocated yet
      if (!self.state.geolocation)
        self.setState({ mapCenter: reactiveLatLng });

      // Set current location
      self.setState({ geolocation: reactiveLatLng });
    })
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
              gaId={ this.state.gaSelected }
              infoBoxState={ this.state.infoBoxState }
              mapCenter={ this.state.mapCenter }
              markerOnClick={ gaId => this.selectGa(gaId) }
              setMapCenter={ mapCenter => this.state.mapCenter }
              setBounds={ bounds => this.mapBounds.set(bounds) }
            />

            <div id="map-boxes-container">
              <MapInfoBox
                gaId={ this.state.gaSelected }
                boxState={ this.state.infoBoxState }
                setBoxState={ this.setInfoBoxState.bind(this) }
              />
              <MapNearbyBox
                gaId={ this.state.gaSelected }
                boxState={ this.state.nearbyBoxState }
                setBoxState={ this.setNearbyBoxState.bind(this) }
                mapBounds={ this.mapBounds.get() }
              />
            </div>

            <div id="map-floating-buttons" style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>
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
