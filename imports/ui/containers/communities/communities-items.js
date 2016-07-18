import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { CommunitiesItems } from '../../components/communities/communities-items';
import { Loading } from '../../components/loading';

import { Communities } from '../../../api/communities/communities';

const composer = (props, onData) => {

  if (Meteor.subscribe('communities-search', props).ready()) {

    const options = {};

    if (props.searchQuery && props.sort == "most-relevant")
      options.sort = { score: { $meta: 'textScore' } };
    else if (props.sort == "largest-first")
      options.sort = { count: -1 };
    else if (props.sort == "smallest-first")
      options.sort = { count: 1 };

    onData(null, {
      communities: Communities.find({}, options).fetch(),
      props: props,
    });

  } else {
    onData(null, {
      communities: [],
      props: props
    });
  }

};

export default composeWithTracker(composer, Loading)(CommunitiesItems);
