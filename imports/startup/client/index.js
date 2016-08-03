import { Meteor } from 'meteor/meteor';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-select/dist/react-select.css';

// Shared JS
import '../shared/index.js';

// Client-side JS
import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/js/bootstrap.min.js';
import './cloudinary-config.js';
import './shareit-config.js';
import './reactga-config.js';

import './subscriptions.js';
import './routes.js';

// Bert Notifications
Bert.defaults = {
  hideDelay: 2000,
  style: 'growl-bottom-right',
  type: 'default',
};
