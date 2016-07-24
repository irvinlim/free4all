import '../shared/index.js';
import './cloudinary-config';
import './service-config';
import './google-analytics-config';

import './accounts/email-templates';
import './browser-policy';
import './fixtures';
import './match-where-checks';
import './api';

// Uncomment to generate random data (disable for production)
// import './data-generate';

Future = Npm.require('fibers/future');
