import { Meteor } from 'meteor/meteor';
import React from 'react';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/header/header';
import LeafletMap from '../components/map/leaflet-map';

import MapInfoBox from '../components/map/map-info-box';
import MapNearbyBox from '../components/map/map-nearby-box';

import { GoToGeolocationButton } from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button-dialog'

import * as LatLngHelper from '../../util/latlng';
import { Bert } from 'meteor/themeteorchef:bert';

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
      mapZoom: null,
      mapMaxZoom: null,
      isModalOpen: false,
      latLngClicked: {lat:"",lng:""},
      locName: "",
      locArr: [],
      isDraggableAdded: false,
      showMarkers: true,
    };

    this.mapBounds = new ReactiveVar( null );

    this.subscription = null;
    this.autorunSub = null;
    this.autorunGeo = null;
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
    this.autorunSub = Tracker.autorun(function () {
      const reactiveDateTime = Chronos.currentTime(Meteor.settings.public.refresh_interval || 60000);
      const reactiveMapBounds = self.mapBounds.get();

      // Re-subscribe every minute or if map center changed
      if (reactiveDateTime && reactiveMapBounds) {
        self.subscription = Meteor.subscribe('giveaways-on-screen', reactiveDateTime, LatLngHelper.mongoBounds(reactiveMapBounds));
      }
    });

    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();

      // Set initial map center, if not geolocated yet
      if (!self.state.geolocation)
        self.setState({ mapCenter: reactiveLatLng });

      // Set current location
      self.setState({ geolocation: reactiveLatLng });
    })
  }

  componentWillUnmount() {
    this.subscription && this.subscription.stop();
    this.autorunSub && this.autorunSub.stop();
    this.autorunGeo && this.autorunGeo.stop();
  }

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
  }

  openInsertDialog(features, coords, removeDraggable) {
    this.setState({ isModalOpen: true });
    this.setState({ latLngClicked: coords });
    let featuresArr = features.map((loc)=> {
      loc.text = loc.place_name;
      loc.value = loc.place_name;
      return loc;
    });
    const selectedLocName = featuresArr[0].text;
    this.setState({ locArr: featuresArr });
    this.setState({ locName: selectedLocName });
    Bert.alert({
      hideDelay: 6000,
      title: 'Location Selected',
      message: selectedLocName,
      type: 'info',
      style: 'growl-top-right',
      icon: 'fa-map-marker'
    });
    if(removeDraggable){
      removeDraggable();
    }

    this.toggleMarkers();
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }
  openModal() {
    this.setState({ isModalOpen: true });
  }

  addDraggable() {
    this.setState({ isDraggableAdded: true });
  }
  noAddDraggable() {
    this.setState({ isDraggableAdded: false });
  }

  toggleMarkers() {
    this.setState({ showMarkers: !this.state.showMarkers });
  }

  resetLoc() {
    this.setState({ 
      latLngClicked: {lat:"",lng:""},
      locArr: [],
      locName: "",
    })
  }

  render() {
    const clickNearbyGa = ga => event => {
      this.selectGa(ga._id);
      this.setState({ mapCenter: LatLngHelper.lnglat2latlng(ga.coordinates) });
      this.setState({ mapZoom: this.state.mapMaxZoom });
    };

    return (
      <MuiThemeProvider muiTheme={ MuiTheme }>
        <div id="main">
          <Header />
          <div className="full-container">
            <LeafletMap
              gaId={ this.state.gaSelected }
              infoBoxState={ this.state.infoBoxState }
              markerOnClick={ gaId => this.selectGa(gaId) }
              mapCenter={ this.state.mapCenter }
              setMapCenter={ mapCenter => this.setState({ mapCenter: mapCenter }) }
              mapZoom={ this.state.mapZoom }
              setMapZoom={ mapZoom => this.setState({ mapZoom: mapZoom })}
              setMapMaxZoom={ mapMaxZoom => this.setState({ mapMaxZoom: mapMaxZoom })}
              setBounds={ bounds => this.mapBounds.set(bounds) }
              openInsertDialog={ this.openInsertDialog.bind(this) }
              isDraggableAdded={ this.state.isDraggableAdded }
              stopDraggableAdded={ this.noAddDraggable.bind(this) }
              showMarkers={ this.state.showMarkers }
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
                nearbyOnClick={ clickNearbyGa }
              />
            </div>

            <div id="map-floating-buttons" style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>
              <GoToGeolocationButton geolocationOnClick={ this.goToGeolocation.bind(this) } />
              <InsertBtnDialog
                isModalOpen={this.state.isModalOpen}
                openModal={this.openModal.bind(this)}
                closeModal={this.closeModal.bind(this)}
                latLng={this.state.latLngClicked}
                locArr={this.state.locArr}
                locName={this.state.locName}
                addDraggable={this.addDraggable.bind(this)}
                toggleMarkers={ this.toggleMarkers.bind(this) }
                resetLoc={ this.resetLoc.bind(this) }
              />
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
