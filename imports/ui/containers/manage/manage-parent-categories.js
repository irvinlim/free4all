import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { Loading } from '../../components/loading';
import { ManageParentCategories } from '../../components/manage/manage-parent-categories';

import { ParentCategories } from '../../../api/parent-categories/parent-categories';

const composer = (props, onData) => {
  if (Meteor.subscribe('parent-categories').ready()) {
    const parentCategories = ParentCategories.find({}, { sort: { relativeOrder: 1 } }).fetch();

    onData(null, { parentCategories, props });
  }
};

export default composeWithTracker(composer, Loading)(ManageParentCategories);
