// Find help here:  https://themeteorchef.com/snippets/using-the-browser-policy-package/

import { BrowserPolicy } from 'meteor/browser-policy-common';

// Allow all content to be served from the current domain
BrowserPolicy.content.allowSameOriginForAll();

// Maps
BrowserPolicy.content.allowImageOrigin( 'api.tiles.mapbox.com' );

// Mapbox Geocoding
BrowserPolicy.content.allowOriginForAll( 'api.tiles.mapbox.com' );

// Fonts
BrowserPolicy.content.allowStyleOrigin( 'fonts.googleapis.com' );
BrowserPolicy.content.allowFontOrigin( 'fonts.gstatic.com' );
BrowserPolicy.content.allowFontDataUrl();

// Image CDN
BrowserPolicy.content.allowImageOrigin( 'res.cloudinary.com' );

// Avatars
BrowserPolicy.content.allowImageOrigin( 'secure.gravatar.com' );
BrowserPolicy.content.allowImageOrigin( 'graph.facebook.com' );
BrowserPolicy.content.allowImageOrigin( '*.fbcdn.net' );
BrowserPolicy.content.allowImageOrigin( '*.googleusercontent.com' );

// Temp
BrowserPolicy.content.allowImageOrigin( 'lorempixel.com' );
