import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import React from 'react';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import LeafletMap from '../components/map/leaflet-map';
import { GoToGeolocationButton } from '../components/map/go-to-geolocation-button'
import InsertBtnDialog from '../components/map/insert-button-dialog'
import EditBtnDialog from '../components/map/edit-button-dialog'

import * as LatLngHelper from '../../util/latlng';
import * as IconsHelper from '../../util/icons';

import { Giveaways } from '../../api/giveaways/giveaways';


export class EditGiveaway extends React.Component {
	constructor(props) {
		super(props);
		const self = this;

		this.state = {
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
			gaEdit: null,
			showDateRange: true,
		};

    this.autorunGeo = null;
    this.subscription = null;
    this.mapBounds = new ReactiveVar( null );

	}


  componentDidMount() {
    const self = this;
    this.autorunGeo = Tracker.autorun(function() {
      const reactiveLatLng = Geolocation.latLng();
      self.setState({ geolocation: reactiveLatLng });
    })

    this.subscription = Meteor.subscribe("giveaway-by-id", this.props.params.id, function(){
      const giveaway = Giveaways.findOne(self.props.params.id);
      self.setState({
        isModalOpen: true,
        gaEdit: giveaway
     });
    })
  }

  componentWillUnmount() {
    this.autorunGeo && this.autorunGeo.stop();
    this.subscription && this.subscription.stop();
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
    return (

      <div className="full-container">
        <LeafletMap
          gaId={ this.props.params.id }
          infoBoxState={ this.state.infoBoxState }
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

        <RefreshIndicator
          size={ 40 }
          left={ $(window).width()/2 }
          top={ 10 }
          status={ this.state.rGeoLoading ? "loading" : "hide" } />

        <div id="map-floating-buttons" style={{ right: 20 + (this.state.nearbyBoxState > 0 ? $("#map-nearby-box").outerWidth() : 0) }}>
          <GoToGeolocationButton geolocationOnClick={ this.goToGeolocation.bind(this) } />
        </div>

        <EditBtnDialog
          isModalOpen={ this.state.isModalOpen }
          openModal={ this.openModal.bind(this) }
          closeModal={ this.closeModal.bind(this) }
          latLng={ this.state.latLngClicked }
          locArr={ this.state.locArr }
          locName={ this.state.locName }
          addDraggable={ this.addDraggable.bind(this) }
          stopDraggableAdded={ this.noAddDraggable.bind(this) }
          hideMarkers={ this.hideMarkers.bind(this) }
          resetLoc={ this.resetLoc.bind(this) }
          gaEdit={ this.state.gaEdit }
          mapCenter={ this.state.mapCenter } />

      </div>

    );
  }
}
