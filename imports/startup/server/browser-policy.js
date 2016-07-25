// Find help here:  https://themeteorchef.com/snippets/using-the-browser-policy-package/

import { BrowserPolicy } from 'meteor/browser-policy-common';

// Allow all content to be served from the current domain
BrowserPolicy.content.allowSameOriginForAll();

// Recommended settings
BrowserPolicy.content.disallowEval();

// Maps
BrowserPolicy.content.allowImageOrigin( 'api.tiles.mapbox.com' );
BrowserPolicy.content.allowImageOrigin( 'api.mapbox.com' );

// Mapbox Geocoding
BrowserPolicy.content.allowImageOrigin( 'api.tiles.mapbox.com' );

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
BrowserPolicy.content.allowImageOrigin( '*.akamaihd.net' );
BrowserPolicy.content.allowImageOrigin( '*.googleusercontent.com' );

// Google Analytics
BrowserPolicy.content.allowOriginForAll( 'https://www.google-analytics.com' );

// iubenda Privacy Policy
BrowserPolicy.content.allowScriptOrigin( 'cdn.iubenda.com' );
BrowserPolicy.content.allowStyleOrigin( 'cdn.iubenda.com' );
BrowserPolicy.content.allowImageOrigin( 'cdn.iubenda.com' );
BrowserPolicy.content.allowImageOrigin( 'www.iubenda.com' );
BrowserPolicy.content.allowFrameOrigin( 'www.iubenda.com' );
