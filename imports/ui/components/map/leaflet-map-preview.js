import React from 'react';
import * as Helper from '../../../util/helper';


export default class LeafletMapPreview extends React.Component{
	constructor(props){
		super(props)

		this.elemId = 'map-preview'
		this.marker = null
		this.map = null
	}

	componentDidMount(){
		this.makeMap(this.elemId)
	}

	componentWillReceiveProps(nextProps){

		// Remove old marker if new one selected
		if(this.marker) 
			this.map.removeLayer(this.marker);		

		this.map.setView(nextProps.previewCoords, nextProps.previewZoom)

		// Marker styles
	    const css = { 'background-color': "#00bcd4", "font-size": "30px" }
	    const iconHTML = '<i class="material-icons">add_location</i>'
	    const icon = this.markerIcon("map-marker", css, {}, iconHTML)
	    
	    this.marker = L.marker(nextProps.previewCoords, { icon: icon, opacity: 1 })
	    this.marker.addTo(this.map)
	}

	makeMap(elemId){
		
		let	mapID = Meteor.settings.public.MapBox.mapID,
        	accessToken = Meteor.settings.public.MapBox.accessToken;

	    Helper.errorIf(!accessToken, "Error: Mapbox access token not defined.")

	    this.map = L.map(elemId, { zoomControl: false });
    	this.map.dragging.disable();
	    this.map.touchZoom.disable();
	    this.map.doubleClickZoom.disable();
	    this.map.scrollWheelZoom.disable();
	    this.map.boxZoom.disable();
	    this.map.keyboard.disable();


	    // Map icon, tile 
	    L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';
	    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    	attribution: 'Imagery from <a href="http://mapbox.com/about/maps/">MapBox</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    	id: mapID,
	    	accessToken: accessToken
	    }).addTo(this.map)

	}

	markerIcon(className, css, attr, content) {
		const $icon = $('<div />').addClass(className).css(css).attr(attr).html(content);
		return L.divIcon({
			iconSize: [40, 54],
			iconAnchor: [20, 54],
			html: Helper.jquery2html($icon),
		});
	}

	render(){
		return (
			<div id={this.elemId}></div>
		)
	}
}