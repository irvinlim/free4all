import { Meteor } from 'meteor/meteor';

import '../shared/index.js';
import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './cloudinary-config.js';
import './shareit-config.js';
import './reactga-config.js';

import './subscriptions.js';
import './routes.js';

// React select styles
import 'react-select/dist/react-select.css';

// Bert Notifications
Bert.defaults = {
  hideDelay: 2000,
  style: 'growl-bottom-right',
  type: 'default',
};
