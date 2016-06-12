import { composeWithTracker } from 'react-komposer';
import { ParentCategories } from '../../api/parent-categories/parent-categories.js';
import { AllCategoriesList } from '../components/all-categories-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (params, onData) => {
  const subscription = Meteor.subscribe('parent-categories');
  if (subscription.ready()) {
    const allCategories = ParentCategories.find().fetch();
    onData(null, { allCategories });
  }
};

export default composeWithTracker(composer, Loading)(AllCategoriesList);
