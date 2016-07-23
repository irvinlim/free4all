import { Meteor } from 'meteor/meteor';
import React from 'react';
import IconButton from 'material-ui/IconButton';

import { voteUp, voteDown, unvote } from '../../../api/giveaways/methods';

import * as GiveawaysHelper from '../../../util/giveaways';
import * as IconsHelper from '../../../util/icons';

const makeVoteClickHandler = (isUpvote, voted, gaId) => {
  return event => {
    if (!Meteor.userId()) return;

    let method = voted ? unvote : isUpvote ? voteUp : voteDown;
    method.call({ userId: Meteor.userId(), giveawayId: gaId });
  };
};

export const GiveawayRatings = ({ giveaway }) => (
  <div className="giveaway-ratings">
    <div className="flex-row nopad">
      <div className="col col-xs-3">
        <IconButton
          className="button-upvote"
          className={ GiveawaysHelper.currentUserUpvoted(giveaway) ? "voted" : "" }
          onTouchTap={ makeVoteClickHandler(true, GiveawaysHelper.currentUserUpvoted(giveaway), giveaway._id) }
          children={ IconsHelper.materialIcon("thumb_up") } />
      </div>
      <div className="col col-xs-3">
        <span className="num_ratings">{ GiveawaysHelper.countUpvotes(giveaway) }</span>
      </div>
      <div className="col col-xs-3">
        <IconButton
          className="button-downvote"
          className={ GiveawaysHelper.currentUserDownvoted(giveaway) ? "voted" : "" }
          onTouchTap={ makeVoteClickHandler(false, GiveawaysHelper.currentUserDownvoted(giveaway), giveaway._id) }
          children={ IconsHelper.materialIcon("thumb_down") } />
      </div>
      <div className="col col-xs-3">
        <span className="num_ratings">{ GiveawaysHelper.countDownvotes(giveaway) }</span>
      </div>
    </div>
  </div>
);
