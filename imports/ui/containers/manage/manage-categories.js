import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { Loading } from '../../components/loading';
import { ManageCategories } from '../../components/manage/manage-categories';

import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { Categories } from '../../../api/categories/categories';

const composer = (props, onData) => {
  if (Meteor.subscribe('all-categories').ready()) {
    onData(null, {
      parentCategories: ParentCategories.find(),
      categories: Categories.find(),
      props
    });
  }
};

export default composeWithTracker(composer, Loading)(ManageCategories);
