import { HTTP } from 'meteor/http'
const geo = require('mapbox-geocoding');

// Mapbox Geocoding
export const geocode = (mapboxAccessToken, query, addState) => {
	let url = 'https://api.tiles.mapbox.com/v4/geocode/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxAccessToken;
	console.log(url);
	HTTP.get(url,{},function( error, response ) {
		if ( error ) {
			console.log( error );
		} else {
			let result = JSON.parse(response.content);
			addState(result.features);
		}
	})
}
// https://api.mapbox.com/geocoding/v5/mapbox.places/-73.989,40.733.json
// Mapbox Reverse Geocoding
export const rgeocode = (mapboxAccessToken, latLng, addState) => {
	let url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + latLng.lng +','+ latLng.lat + '.json?access_token=' + mapboxAccessToken;
	console.log(url);
	HTTP.get(url,{},function( error, response ) {
		if ( error ) {
			console.log( error );
		} else {
			let result = JSON.parse(response.content);
			addState(result.features, latLng);
		}
	})
}


