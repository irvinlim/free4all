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

    this.draggableMarker = null;
  }

  componentDidMount() {
    this.resizeFullContainer();
    this.mapObject = new LeafletMapObject('main-map');
    this.observeChanges();
    this.registerEventHandlers();
  }

  resizeFullContainer() {
    // Resize full-container to adjust for navigation bar
    $(window).resize(function() {
      $('.full-container').css('height', window.innerHeight - $("#header").outerHeight());
    });
    $(window).resize();
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
    const zoomend = this.mapObject.registerEventHandler('zoomend', function(event) {
      self.props.setMapCenter(this.getCenter());
      self.props.setMapZoom(this.getZoom());
      self.props.setMapMaxZoom(this.getMaxZoom());
      self.props.setBounds(this.getBounds());
    });
    const dragend = this.mapObject.registerEventHandler('dragend', function(event) {
      self.props.setMapCenter(this.getCenter());
      self.props.setMapZoom(this.getZoom());
      self.props.setMapMaxZoom(this.getMaxZoom());
      self.props.setBounds(this.getBounds());
    });

    Meteor.setTimeout(zoomend.trigger, 500);
    Meteor.setTimeout(dragend.trigger, 500);

    if(!self.props.isDbClickDisabled){
      this.mapObject.registerEventHandler('dblclick', function(event) {
        self.props.addRGeoSpinner();
        rgeocode(Meteor.settings.public.MapBox.accessToken, event.latlng, self.props.openInsertDialog, 
          self.props.rmvRGeoSpinner);
      });  
    }
    
  }

  removeDraggable() {
    this.mapObject.map.removeLayer(this.draggableMarker);
    this.draggableMarker = null;
  }

  componentWillReceiveProps(nextProps) {
    const self = this;
    // Add reverse geocode marker
    if (nextProps.isDraggableAdded) {
      // Remove previous marker if any
      if(this.draggableMarker) self.removeDraggable();

      const css = { 'background-color': "#00bcd4", "font-size": "30px" };
      const iconHTML = '<i class="material-icons">add_location</i>'
      const icon = this.mapObject.markerIcon("map-marker", css, {}, iconHTML);

      const marker = L.marker(nextProps.mapCenter, { icon: icon, draggable: 'true', opacity: 0.75 });
      const popup = L.popup({ closeOnClick: true, className: 'dPopup' }).setContent('<p>Drag to select location!</p>');

      marker.on('dragstart', function(event){
        const marker = event.target;
        marker.setOpacity(1);
      })

      marker.on('dragend', function(event){
        const marker = event.target;
        const position = marker.getLatLng();
        marker.setLatLng(position,{ draggable: 'true' }).update();
        nextProps.addRGeoSpinner();
        rgeocode(Meteor.settings.public.MapBox.accessToken, position, self.props.openInsertDialog, 
          self.props.rmvRGeoSpinner, self.removeDraggable.bind(self));
      });

      this.props.stopDraggableAdded();
      this.mapObject.map.addLayer(marker);
      this.draggableMarker = marker;
      marker.bindPopup(popup).openPopup();
    }

    // Hide or show map markers
    if (this.mapObject && this.mapObject.map) {
      if (nextProps.showMarkers)
        this.mapObject.map.addLayer(this.mapObject.markerClusterGroup);
      else
        this.mapObject.map.removeLayer(this.mapObject.markerClusterGroup);
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
