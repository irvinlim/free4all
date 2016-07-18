import { Meteor } from 'meteor/meteor';
import React from 'react';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../components/header/header';
import LeafletMap from '../components/map/leaflet-map';

import MapInfoBox from '../components/map/map-info-box';
import MapCommunityBox from '../components/map/map-community-box';

import { GoToGeolocationButton } from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button-dialog'
import EditBtnDialog from '../components/map/edit-button-dialog'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';
import { Bert } from 'meteor/themeteorchef:bert';

export class Community extends React.Component {
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
      showMarkers: true,
      // isModalOpen: false,
      // latLngClicked: {lat:"",lng:""},
      // locName: "",
      // locArr: [],
      // isDraggableAdded: false,
      // rGeoLoading: false,
      // gaEdit: null,
      // showDateRange: true,
    };

    this.userUntilDate = new ReactiveVar( moment().set('hour', 0).set('minute',0).add(1,'w').toDate() );
    this.userFromDate = new ReactiveVar( moment().set('hour', 0).set('minute',0).toDate() );
    this.isAllGa = new ReactiveVar( false );

    this.mapBounds = new ReactiveVar( null );

    this.subscriptionUserIds = null;
    this.autorunSub = null;
    this.autorunGeo = null;
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
    self.subscriptionUserIds = Meteor.subscribe('userIds-by-commId', self.props.params.id);
    // giveaways-by-users, userIds

    this.autorunSub = Tracker.autorun(function () {
      const userFromDate = self.userFromDate.get();
      const userUntilDate = self.userUntilDate.get();
      const isAllGa = self.isAllGa.get();

      // trigger ui update
      // self.setState({showDateRange: self.state.showDateRange});


      // Re-subscribe when date range changes
      // if (userFromDate && userUntilDate) {
      //   self.subscriptionUserIds = Meteor.subscribe('users-giveaways-within-date', userFromDate, userUntilDate, isAllGa);
      // }
    });

    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();

      // Set initial map center, if not geolocated yet
      // if (!self.state.geolocation)
      //   self.setState({ mapCenter: reactiveLatLng });

      // Set current location
      self.setState({ geolocation: reactiveLatLng });
    })

  }

  componentWillUnmount() {
    this.subscriptionUserIds && this.subscriptionUserIds.stop();
    this.autorunSub && this.autorunSub.stop();
    this.autorunGeo && this.autorunGeo.stop();
  }

  goToGeolocation() {
    this.setState({ mapCenter: this.state.geolocation });
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

  showMarkers() {
    this.setState({ showMarkers: true });
  }

  hideMarkers() {
    this.setState({ showMarkers: false });
  }

  resetLoc() {
    this.setState({
      latLngClicked: {lat:"",lng:""},
      locArr: [],
      locName: "",
    })
  }

  addRGeoSpinner(){
    this.setState({ rGeoLoading: true });
  }

  rmvRGeoSpinner(){
    this.setState({ rGeoLoading: false });
  }

  handleUserUntilDate(event, date){
    this.userUntilDate.set(moment(date).add(23,'h').add(59,'m').toDate());
  }
  handleUserFromDate(event, date){
    this.userFromDate.set(date);
  }

  handleAllUserGiveaways(){
    this.setState({ showDateRange: !this.state.showDateRange });
    this.isAllGa.set(!this.isAllGa.get());
  }

  openEditDialog(features, coords, removeDraggable) {
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
    this.showMarkers();
  }

  render() {
    const clickNearbyGa = ga => event => {
      this.selectGa(ga._id);
      this.setState({ mapCenter: LatLngHelper.lnglat2latlng(ga.coordinates) });
      this.setState({ mapZoom: this.state.mapMaxZoom });
    };

    const editGa = ga => event => {
      this.setState({ isModalOpen: true });
      this.setState({ gaEdit: ga });
    };

    return (
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
          openInsertDialog={ this.openEditDialog.bind(this) }
          isDraggableAdded={ this.state.isDraggableAdded }
          stopDraggableAdded={ this.noAddDraggable.bind(this) }
          showMarkers={ this.state.showMarkers }
          addRGeoSpinner={ this.addRGeoSpinner.bind(this) }
          rmvRGeoSpinner={ this.rmvRGeoSpinner.bind(this) }
          isDbClickDisabled= { true } />

        <div id="map-boxes-container">
          <MapInfoBox
            gaId={ this.state.gaSelected }
            boxState={ this.state.infoBoxState }
            setBoxState={ this.setInfoBoxState.bind(this) } />
          <MapCommunityBox
            gaId={ this.state.gaSelected }
            boxState={ this.state.nearbyBoxState }
            setBoxState={ this.setNearbyBoxState.bind(this) }
            mapBounds={ this.mapBounds.get() }
            nearbyOnClick={ clickNearbyGa }
            userUntilDate={ this.userUntilDate.get() }
            userFromDate={ this.userFromDate.get() }
            handleUserUntilDate={ this.handleUserUntilDate.bind(this) }
            handleUserFromDate={ this.handleUserFromDate.bind(this) }
            handleAllUserGiveaways={ this.handleAllUserGiveaways.bind(this) }
            editGa={ editGa }
            showDateRange={ this.state.showDateRange } />
        </div>

        <div id="map-floating-buttons" style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>
          <GoToGeolocationButton geolocationOnClick={ this.goToGeolocation.bind(this) } />
        </div>

      </div>

    );
  }
}

Community.propTypes = {
  name: React.PropTypes.string,
};
