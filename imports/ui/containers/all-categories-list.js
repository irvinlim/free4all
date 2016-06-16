import { composeWithTracker } from 'react-komposer';
import { ParentCategories } from '../../api/parent-categories/parent-categories.js';
import { Categories } from '../../api/categories/categories.js';
import { AllCategoriesList } from '../components/map/all-categories-list.js';
import { Loading } from '../components/loading.js';
import { Meteor } from 'meteor/meteor';

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('all-categories');
  if (subscription.ready()) {
    const allCategories = [ParentCategories.find().fetch(), Categories.find().fetch()];
    onData(null, { allCategories, props});
  }
};

export default composeWithTracker(composer, Loading)(AllCategoriesList);
