import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { CommunitiesItems } from '../../components/communities/communities-items';
import { Loading } from '../../components/loading';

import { Communities } from '../../../api/communities/communities';

const composer = (props, onData) => {
  if(!props.user || !props.user.communityIds)
    return

  const options = {};

  if (Meteor.subscribe('communities-search', props).ready()) {

    if (props.searchQuery && props.sort == "most-relevant")
      options.sort = { score: { $meta: 'textScore' } };
    else if (props.sort == "largest-first")
      options.sort = { count: -1 };
    else if (props.sort == "smallest-first")
      options.sort = { count: 1 };

    const communities = Communities.find({_id: {$in: props.user.communityIds} }, options).fetch();

    onData(null, {
      communities: communities,
      props: props,
    });    

  } else {
    onData(null, {
      communities: [],
      props: props
    });
  }
};

export default MyCommunitiesItems = composeWithTracker(composer, Loading)(CommunitiesItems);
