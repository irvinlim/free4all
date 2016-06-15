import '../shared/index.js';
import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './routes.js';
import './subscriptions.js';
import './cloudinary-config.js';

Bert.defaults.style = 'growl-top-right';
