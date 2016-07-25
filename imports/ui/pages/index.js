import { Meteor } from 'meteor/meteor';
import React from 'react';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/header/header';
import LeafletMap from '../components/map/leaflet-map';

import MapInfoBox from '../components/map/map-info-box';
import MapNearbyBox from '../components/map/map-nearby-box';
import SelectHomeDialog from '../components/form/select-home-dialog';
import GoToHomeButton from '../components/form/go-to-home-button';

import { GoToGeolocationButton } from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button-dialog'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';
import { Bert } from 'meteor/themeteorchef:bert';

export class Index extends React.Component {
  constructor(props) {
    super(props);
    const self = this;

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
      rGeoLoading: false,
      isHomeLocOpen: false,
      homeLocation: null,
      homeZoom: null,
      user: null,
    };

    this.mapBounds = new ReactiveVar( null );

    this.subscription = null;
    this.autorunSub = null;
    this.autorunGeo = null;
    this.autorunHome = null;
    this.autorunAuth = null;
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

  componentDidMount() {
    const self = this;

    // Autorun subscription
    this.autorunSub = Tracker.autorun(function () {
      const reactiveDateTime = Chronos.currentTime(Meteor.settings.public.refresh_interval || 60000);
      const reactiveMapBounds = self.mapBounds.get();

      // Re-subscribe every minute or if map center changed
      if (reactiveDateTime && reactiveMapBounds) {
        self.subscription = Meteor.subscribe('giveaways-on-screen', reactiveDateTime, LatLngHelper.mongoBounds(reactiveMapBounds));
      }
    });

    // Autorun track device location
    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();

      // Disabled initialize map center, if not geolocated yet
      // if (!self.state.geolocation)
      //   self.setState({ mapCenter: reactiveLatLng });

      // Set current location
      self.setState({ geolocation: reactiveLatLng });
    })

    // Autorun check user authenticated
    this.autorunAuth = Tracker.autorun(function() {
      const user = Meteor.user();
      if (user && user.homeLocation && user.homeZoom) {
        // homeLocation state is for goToHomeLocation Button
        self.setState({ homeLocation: user.homeLocation, homeZoom: user.homeZoom });
        // homeLocation session is for initial map center
        Session.setPersistent('homeLocation', { coordinates: user.homeLocation, zoom: user.homeZoom });
      }
      self.setState({ user });
    });

    this.autorunHome = Tracker.autorun(function(){
      let homeLoc = Session.get('homeLocation');
      if (homeLoc)
        self.setState({
          homeLocation: homeLoc.coordinates,
          homeZoom: homeLoc.zoom
        });
    });

    // Set initial map center for returning visitor, open dialog if not set
    let homeLoc = Session.get('homeLocation');
    if (homeLoc) {
      self.setState({
        mapCenter: homeLoc.coordinates,
        homeLocation: homeLoc.coordinates,
        mapZoom: homeLoc.zoom
      });
    } else if (this.props.location.pathname !== "/login") {
      // Open dialog only if login dialog is not to be opened
      self.setState({ isHomeLocOpen: true });
    }
  }

  componentWillUnmount() {
    this.subscription && this.subscription.stop();
    this.autorunSub && this.autorunSub.stop();
    this.autorunHome && this.autorunHome.stop();
    this.autorunGeo && this.autorunGeo.stop();
    this.autorunAuth && this.autorunAuth.stop();
  }

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
  }

  goToHomeLoc(){
    this.setState({
      mapCenter: this.state.homeLocation,
      mapZoom: this.state.homeZoom
    });
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

    if (removeDraggable)
      removeDraggable();

    this.showMarkers();
  }

  showMarkers() {
    this.setState({ showMarkers: true });
  }

  resetLoc() {
    this.setState({
      latLngClicked: {lat:"",lng:""},
      locArr: [],
      locName: "",
    });
  }

  setHomeLoc(uniName){
    let coords, zoom;
    this.setState({ isHomeLocOpen: false });
    switch(uniName){
      case 'nus':
        coords = [1.2993372,103.777426];
        zoom = 16
        Session.setPersistent('homeLocation', {coordinates: coords, zoom: zoom});
        this.setState({ mapZoom: zoom, mapCenter: coords, homeLocation: coords, homeZoom: zoom});
        // TODO: go to the community route instead of setting mapcenter and zoom
        break;
      case 'ntu':
        coords = [1.3484298,103.6837826];
        zoom = 16
        Session.setPersistent('homeLocation', {coordinates: coords, zoom: zoom});
        this.setState({ mapZoom: zoom, mapCenter: coords, homeLocation: coords, homeZoom: zoom});

        break;
      case 'smu':
        coords = [1.2969614,103.8513713];
        zoom = 18
        Session.setPersistent('homeLocation', {coordinates: coords, zoom: zoom});
        this.setState({ mapZoom: zoom, mapCenter: coords, homeLocation: coords, homeZoom: zoom});
        break;
      default:
        break;
    }
  }


  render() {
    const clickNearbyGa = ga => event => {
      this.selectGa(ga._id);
      this.setState({ mapCenter: LatLngHelper.lnglat2latlng(ga.coordinates) });
      this.setState({ mapZoom: this.state.mapMaxZoom });
    };

    return (
      <div className="full-container">
        <LeafletMap
          gaId={ this.state.gaSelected }
          infoBoxState={ this.state.infoBoxState }
          markerOnClick={ gaId => this.selectGa(gaId) }
          mapCenter={ this.state.mapCenter }
          setMapCenter={ mapCenter => this.setState({ mapCenter }) }
          mapZoom={ this.state.mapZoom }
          setMapZoom={ mapZoom => this.setState({ mapZoom: mapZoom })}
          setMapMaxZoom={ mapMaxZoom => this.setState({ mapMaxZoom: mapMaxZoom })}
          setBounds={ bounds => this.mapBounds.set(bounds) }
          openInsertDialog={ this.openInsertDialog.bind(this) }
          isDraggableAdded={ this.state.isDraggableAdded }
          stopDraggableAdded={ ()=>{this.setState({ isDraggableAdded: false })} }
          showMarkers={ this.state.showMarkers }
          addRGeoSpinner={ ()=>{this.setState({ rGeoLoading: true })} }
          rmvRGeoSpinner={ ()=>{this.setState({ rGeoLoading: false })} }
          isDbClickDisabled= { false }
        />
        <RefreshIndicator
          size={40}
          top={10}
          left={ $(window).width() / 2.05 }
          status={ this.state.rGeoLoading ? "loading" : "hide" }
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

        <SelectHomeDialog
          isHomeLocOpen={ this.state.isHomeLocOpen }
          closeSelectHomeModal={ () => this.setState({ isHomeLocOpen: false }) }
          setHomeLoc={this.setHomeLoc.bind(this)} />

        <div id="map-floating-buttons" style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>

          <GoToGeolocationButton
            geolocationOnClick={ this.goToGeolocation.bind(this) } />

          <GoToHomeButton
            goToHomeLoc = { this.goToHomeLoc.bind(this) }
            homeLocation = { this.state.homeLocation } />

          { this.state.user ?
          <InsertBtnDialog
            isModalOpen={this.state.isModalOpen}
            openModal={ ()=>{this.setState({ isModalOpen: true })} }
            closeModal={ ()=>{this.setState({ isModalOpen: false })} }
            latLng={this.state.latLngClicked}
            locArr={this.state.locArr}
            locName={this.state.locName}
            addDraggable={ ()=>{this.setState({ isDraggableAdded: true })} }
            stopDraggableAdded={ ()=>{this.setState({ isDraggableAdded: false })} }
            hideMarkers={ ()=>{this.setState({ showMarkers: false })} }
            resetLoc={ this.resetLoc.bind(this) }
            mapCenter={ this.state.mapCenter }
            user={ this.state.user }
            zoom={ this.state.mapZoom } />
          :
          <div>
            <IconButton
              tooltip="Login to add giveaways"
              style={{ zIndex: 1, position: "absolute" }} />
            <FloatingActionButton disabled={true} >
              { IconsHelper.materialIcon("add", {color:"black"}) }
            </FloatingActionButton>
          </div>
          }
        </div>
      </div>
    );
  }
}

Index.propTypes = {
  name: React.PropTypes.string,
};
