import { HTTP } from 'meteor/http'
const geo = require('mapbox-geocoding');

// Mapbox Geocoding
let geoTimeout;
export const geocode = (mapboxAccessToken, query, mapCenter, addState) => {
	let url = 'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query)
		+ '.json?proximity=' + mapCenter.lng + ',' + mapCenter.lat + '&access_token=' + mapboxAccessToken;

	if(geoTimeout) Meteor.clearTimeout(geoTimeout);

	geoTimeout = Meteor.setTimeout( ()=>{
		HTTP.get(url,{},function( error, response ) {
			if ( error ) {
				console.log( error );
			} else {
				let result = JSON.parse(response.content);
				addState(result.features);
				geoTimeout = null;
			}
		})
	}, 500)
}
// https://api.mapbox.com/geocoding/v5/mapbox.places/-73.989,40.733.json
// Mapbox Reverse Geocoding
let rgeoTimeout;
export const rgeocode = (mapboxAccessToken, latLng, rmvRGeoSpinner, rmvRGeoListener, setConfirmDialog) => {

	let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + latLng.lng +','+ latLng.lat
		+ '.json?access_token=' + mapboxAccessToken + '&autocomplete=true';
	if(rgeoTimeout) Meteor.clearTimeout(rgeoTimeout);

	rgeoTimeout = Meteor.setTimeout( ()=>{
		HTTP.get(url,{},function( error, response ) {
			if ( error ) {
				console.log( error );
			} else {
				let result = JSON.parse(response.content);
        setConfirmDialog(result.features, latLng, rmvRGeoListener);
				rgeoTimeout = null;
				rmvRGeoSpinner();
			}
		})
	}, 1000);

}


