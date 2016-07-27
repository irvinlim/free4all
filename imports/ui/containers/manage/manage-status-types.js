import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { Loading } from '../../components/loading';
import { ManageStatusTypes } from '../../components/manage/manage-status-types';

import { StatusTypes } from '../../../api/status-types/status-types';

const composer = (props, onData) => {
  if (Meteor.subscribe('status-types').ready()) {
    const statusTypes = StatusTypes.find({}, { sort: { relativeOrder: 1 } }).fetch();

    onData(null, { statusTypes, props });
  }
};

export default composeWithTracker(composer, Loading)(ManageStatusTypes);
