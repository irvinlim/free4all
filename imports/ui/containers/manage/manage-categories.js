import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { Loading } from '../../components/loading';
import { ManageCategories } from '../../components/manage/manage-categories';

import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { Categories } from '../../../api/categories/categories';

const composer = (props, onData) => {
  if (Meteor.subscribe('all-categories').ready()) {
    const parentCategories = ParentCategories.find({}, { sort: { relativeOrder: 1 } }).fetch();
    const categories = Categories.find({}, { sort: { relativeOrder: 1 } }).fetch();

    const orderedCategories = [];
    parentCategories.forEach(parentCat => {
      const children = [];
      categories.forEach(cat => {
        if (cat.parent !== parentCat._id)
          return true;

        children.push(cat._id);
      });

      orderedCategories.push({ parentCat, children });
    });

    onData(null, { orderedCategories, props });
  }
};

export default composeWithTracker(composer, Loading)(ManageCategories);
