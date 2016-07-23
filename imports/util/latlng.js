// LatLng Helper

export const is_equal_latlng = (latlng1, latlng2) => latlng1 && latlng2 && latlng1.lat && latlng1.lng && latlng2.lat && latlng2.lng && latlng1.lat == latlng2.lat && latlng1.lng == latlng2.lng;
export const is_equal_bounds = (bounds1, bounds2) => bounds1 && bounds2 && is_equal_latlng(bounds1._northEast, bounds2._northEast) && is_equal_latlng(bounds1._southWest, bounds2._southWest);
export const mongoCoords = (coords) => [coords.lng, coords.lat];
export const mongoBounds = (mapBounds) => [mongoCoords(mapBounds._southWest), mongoCoords(mapBounds._northEast)];
export const lnglat2latlng = (lnglat) => [lnglat[1], lnglat[0]];
export const lnglat2object = (lnglat) => ({ lat: lnglat[1], lng: lnglat[0] });
