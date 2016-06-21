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

