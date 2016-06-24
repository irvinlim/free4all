import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Giveaways } from '../../../api/giveaways/giveaways';
import LeafletMapObject from './leaflet-map-object';
import { rgeocode } from '../../../api/geocode/methods.js';

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

    // Observe changes in giveaways
    Giveaways.find().observe({
      added: ga => {
        self.mapObject.addMarker(ga._id, ga, clickHandler);
      },
      changed: ga => {
        self.mapObject.updateMarker(ga._id, ga, clickHandler);
      },
      removed: ga => {
        self.mapObject.removeMarker(ga._id, ga, clickHandler);
      },
    });
  }

  registerEventHandlers() {
    const self = this;
    this.mapObject.registerEventHandler('moveend', function(event) {
      self.props.setMapCenter(this.getCenter());
      self.props.setMapZoom(this.getZoom());
      self.props.setMapMaxZoom(this.getMaxZoom());
      self.props.setBounds(this.getBounds());

      // Update selected map marker
      if (self.props.gaId)
        $(".map-marker").removeClass('selected').filter("[ga-id="+self.props.gaId+"]").addClass('selected');
    }).trigger();

    this.mapObject.registerEventHandler('dblclick', function(event){
      rgeocode(Meteor.settings.public.MapBox.accessToken, event.latlng, self.props.openInsertDialog);
    })
  }

  removeDraggable() {
    this.mapObject.map.removeLayer(this.draggableMarker);
  }

  componentWillReceiveProps(nextProps){
    const self = this;
    if(nextProps.isDraggableAdded){

      const css = { 'background-color': "#00bcd4", "font-size": "30px" };
      const iconHTML = '<i class="material-icons">add_location</i>'
      const icon = this.mapObject.markerIcon("map-marker", css, {}, iconHTML);

      const marker = L.marker(nextProps.mapCenter, {icon:icon, draggable:'true', opacity:0.75});
      const popup = L.popup({closeOnClick: true, className:'dPopup'}).setContent('<p>Drag to select location!</p>')

      marker.on('dragstart',function(event){
        const marker = event.target;
        marker.setOpacity(1);
      })

      marker.on('dragend', function(event){
        const marker = event.target;
        const position = marker.getLatLng();
        rgeocode(Meteor.settings.public.MapBox.accessToken, position, self.props.openInsertDialog, self.removeDraggable.bind(self));
        marker.setLatLng(position,{draggable:'true'}).update();
      });

      this.props.stopDraggableAdded();
      this.mapObject.map.addLayer(marker);
      this.draggableMarker = marker;
      marker.bindPopup(popup).openPopup();

    }

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

    // Update selected map marker
    if (this.props.gaId && this.props.gaId != prevProps.gaId)
      $(".map-marker").removeClass('selected').filter("[ga-id="+this.props.gaId+"]").addClass('selected');
  }

  render() {
    return (
      <div id="main-map"></div>
    );
  }
}
