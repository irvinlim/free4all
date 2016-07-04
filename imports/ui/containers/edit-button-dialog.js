import { composeWithTracker } from 'react-komposer';
import { StatusTypes } from '../../api/status-types/status-types.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';
import { EditBtnDialog } from '../components/map/edit-button-dialog.js'

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('status-types');
  if (subscription.ready()) {
    const StatusTypes = StatusTypes.find().fetch();
    onData(null, { StatusTypes });
  }
};

export default composeWithTracker(composer, Loading)(EditBtnDialog);
