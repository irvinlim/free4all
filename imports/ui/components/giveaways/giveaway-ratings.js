import { Meteor } from 'meteor/meteor';
import React from 'react';
import IconButton from 'material-ui/IconButton';

import { voteUp, voteDown, unvote } from '../../../api/giveaways/methods';

import * as GiveawaysHelper from '../../../util/giveaways';
import * as IconsHelper from '../../../util/icons';

let store;

const makeVoteClickHandler = (isUpvote, voted, gaId) => {
  return event => {
    if (!Meteor.userId())
      store.dispatch({ type: 'OPEN_LOGIN_DIALOG', message: "Login to vote on a giveaway!" });

    let method = voted ? unvote : isUpvote ? voteUp : voteDown;
    method.call({ userId: Meteor.userId(), giveawayId: gaId });
  };
};

export class GiveawayRatings extends React.Component {
  render() {
    const { giveaway } = this.props;
    store = this.context.store;

    return (
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
  }
}

GiveawayRatings.contextTypes = {
  store: React.PropTypes.object
};
