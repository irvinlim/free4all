import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { ManageUsersItems } from '../../components/manage/manage-users-items';
import { Loading } from '../../components/loading';

const composer = (props, onData) => {
  if (Meteor.subscribe('user-search', props).ready()) {

    const selector = {};
    const options = {};

    // Filter
    if (props.role)
      selector.role = props.role;

    // Search
    if (props.searchQuery)
      selector.$text = { $search: props.searchQuery };

    // Sorting
    if (props.searchQuery && props.sort == "most-relevant")
      options.sort = { score: { $meta: 'textScore' } };
    else if (props.sort == "name-asc")
      options.sort = { 'profile.name': 1 };
    else if (props.sort == "name-desc")
      options.sort = { 'profile.name': -1 };

    onData(null, {
      users: Meteor.users.find(selector, options).fetch(),
      props: props,
    });

  }
};

export default composeWithTracker(composer, Loading)(ManageUsersItems);
