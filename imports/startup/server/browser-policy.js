// Find help here:  https://themeteorchef.com/snippets/using-the-browser-policy-package/

import { BrowserPolicy } from 'meteor/browser-policy-common';

BrowserPolicy.content.allowImageOrigin( 'api.tiles.mapbox.com' );
BrowserPolicy.content.allowStyleOrigin( 'fonts.googleapis.com' );
BrowserPolicy.content.allowFontOrigin( 'fonts.gstatic.com' );
BrowserPolicy.content.allowFontDataUrl();
