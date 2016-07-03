import { composeWithTracker } from 'react-komposer';
import { ParentCategories } from '../../../api/parent-categories/parent-categories';
import { Categories } from '../../../api/categories/categories';
import { AllCategoriesList } from '../../components/categories/all-categories-list';
import { Loading } from '../../components/loading';
import { Meteor } from 'meteor/meteor';

const composer = (props, onData) => {
  const subscription = Meteor.subscribe('all-categories');
  if (subscription.ready()) {
    const allCategories = [ParentCategories.find().fetch(), Categories.find().fetch()];
    onData(null, { allCategories, props});
  }
};

export default composeWithTracker(composer, Loading)(AllCategoriesList);
