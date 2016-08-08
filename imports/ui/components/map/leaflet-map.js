import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../../api/giveaways/giveaways';
import LeafletMapObject from './leaflet-map-object';
import { rgeocode } from '../../../util/geocode.js';

import * as LatLngHelper from '../../../util/latlng';

export default class LeafletMap extends React.Component {
  constructor(props) {
    super(props);

    this.mapObject = null;
    this.hiddenMarker = null;
  }

  componentDidMount() {
    this.resizeFullContainer();
    this.mapObject = new LeafletMapObject('main-map');
    this.observeChanges();
    this.registerEventHandlers();
    this.setInitialMapCenterZoom();
  }

  resizeFullContainer() {
    // Resize full-container to adjust for navigation bar
    $(window).resize(function() {
      $('.full-container').css('height', window.innerHeight - $("#header").outerHeight());
    });
    $(window).resize();
  }

  setInitialMapCenterZoom(){
    this.props.setMapCenter(this.mapObject.map.getCenter());
    this.props.setMapZoom(this.mapObject.map.getZoom());
  }

  observeChanges() {
    const self = this;
    const clickHandler = (gaId) => this.props.markerOnClick(gaId);
    const callbackHandler = (id) => this.updateSelected();

    // Observe changes in giveaways
    Giveaways.find().observe({
      added: ga => {
        self.mapObject.addMarker(ga._id, ga, clickHandler, callbackHandler);
      },
      changed: ga => {
        self.mapObject.updateMarker(ga._id, ga, clickHandler, callbackHandler);
      },
      removed: ga => {
        self.mapObject.removeMarker(ga._id, ga, clickHandler, callbackHandler);
      },
    });
  }

  registerEventHandlers() {
    const self = this;
    const zoomDragEnd = this.mapObject.registerEventHandler('zoomend dragend', function(event) {
      const map = self.mapObject.map;
      const center = map.getCenter();
      self.props.setMapCenter(center);
      self.props.setMapZoom(map.getZoom());
      self.props.setMapMaxZoom(map.getMaxZoom());
      if(self.hiddenMarker)
        self.hiddenMarker.setLatLng(center);
    });
    Meteor.setTimeout(zoomDragEnd.trigger, 500);
  }

  removeHiddenMarker() {
    this.mapObject.map.removeLayer(this.hiddenMarker);
    this.hiddenMarker = null;
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    const mapInstance = this.mapObject.map;

    // Add reverse geocode marker
    if (nextProps.rGeoTrigger) {

      // To prevent repeated run on prop change
      this.props.rmvRGeoTrigger();

      const css = { "display": "none" };
      const invisibleIcon = this.mapObject.markerIcon("map-marker", css, {});

      const invisibleMarker = L.marker(nextProps.mapCenter, { icon: invisibleIcon });
      const popup = L.popup({ closeOnClick: true, className: 'centerMarkerPopup' })
        .setContent('<p>Drag the map to select location!</p>');

      // Remove previous marker if any
      if(this.hiddenMarker) self.removeHiddenMarker();
      mapInstance.addLayer(invisibleMarker);
      this.hiddenMarker = invisibleMarker;

      invisibleMarker.bindPopup(popup).openPopup();

      mapInstance.addOneTimeEventListener('zoomstart dragstart', function(event){
          mapInstance.removeLayer(popup);
      })

      mapInstance.on('zoomend dragend', function rgeo(event){
        const accessToken = Meteor.settings.public.MapBox.accessToken;
        nextProps.addRGeoSpinner();
        const rmvRGeoListener = mapInstance.off.bind(this, 'zoomend dragend', rgeo);
        Meteor.setTimeout(function(){
          rgeocode(accessToken, mapInstance.getCenter(), nextProps.rmvRGeoSpinner, rmvRGeoListener, nextProps.setConfirmDialog);
        },500);
      })
    }

    // Hide or show map markers
    if (this.mapObject && this.mapObject.map) {
      if (nextProps.showMarkers)
        this.mapObject.map.addLayer(this.mapObject.markerClusterGroup);
      else
        this.mapObject.map.removeLayer(this.mapObject.markerClusterGroup);
    }

    // Update map tiles
    if(nextProps.mapURL){
      this.mapObject.removeExtraTileLayer();
      this.mapObject.addExtraTileLayer(nextProps.mapURL);
      this.props.removeMapURLState(); // To prevent multiple calls
    }

    // Set scrollWheelZoom behaviour
    if (nextProps.scrollWheelZoom !== undefined && nextProps.scrollWheelZoom !== this.mapObject.map.options.scrollWheelZoom) {
      console.log(this.mapObject.map.options.scrollWheelZoom);
      this.mapObject.map.options.scrollWheelZoom = nextProps.scrollWheelZoom;
    }

  }

  componentDidUpdate(prevProps, prevState) {
    // Set new zoom level & map center, if either is changed.
    if (this.props.mapZoom && this.props.mapCenter) {
      if (this.props.mapZoom != prevProps.mapZoom && !LatLngHelper.is_equal_latlng(this.props.mapCenter, prevProps.mapCenter))
        this.mapObject.map.setView(this.props.mapCenter, this.props.mapZoom);
      else if (this.props.mapZoom != prevProps.mapZoom)
        this.mapObject.map.setZoom(this.props.mapZoom);
      else if (!LatLngHelper.is_equal_latlng(this.props.mapCenter, prevProps.mapCenter))
        this.mapObject.map.panTo(this.props.mapCenter);
    }

    this.updateSelected();
  }

  updateSelected() {
    // Update selected map marker
    $(".map-marker").removeClass('selected');
    if (this.props.gaId)
      $(".map-marker[ga-id="+this.props.gaId+"]").addClass('selected');
  }

  render() {
    return (
      <div id="main-map"></div>
    );
  }
}
