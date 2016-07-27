import React from 'react';
import Paper from 'material-ui/Paper';
import PaperCard from '../../layouts/paper-card';

import { pluralizer } from '../../../util/helper';
import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';
import * as LayoutHelper from '../../../util/layout';
import * as GiveawaysHelper from '../../../util/giveaways';

const AboutAuthor = ({ ga, user, shareCount }) => (
  <div>
    <h3>About the Author</h3>

    <div style={{ margin: "20px 0 10px" }}>
      <div style={{ width: 84, display: "inline-block" }}>
        { UsersHelper.getAvatar(user, 64, { margin: "0 auto", display: "block" }) }
      </div>
      <div style={{ width: "calc(100% - 94px)", marginLeft: 10, display: "inline-block", verticalAlign: "top" }}>
        <h4 style={{ marginTop: 10 }}>{ UsersHelper.getFullName(user) }</h4>
        <h5>{ shareCount } { pluralizer(shareCount, "giveaway", "giveaways") } shared</h5>
      </div>
    </div>
  </div>
);

const MetaStatsRow = (icon, text) => LayoutHelper.twoColumns(IconsHelper.icon("fa fa-" + icon), text, 16, 6, 4, "meta-stats-row");

const MetaInfo = ({ ga, commentCount, pageViews }) => {
  const ratings = GiveawaysHelper.countTotalVotes(ga);
  const comments = commentCount;
  const updates = GiveawaysHelper.countTotalStatusUpdates(ga);

  return (
    <div>
      <h3>Statistics</h3>

      { MetaStatsRow("eye", pageViews + " " + pluralizer(ratings, "page view", "page views")) }
      { MetaStatsRow("star-o", ratings + " " + pluralizer(ratings, "rating", "ratings") + " in total") }
      { MetaStatsRow("comments", comments + " " + pluralizer(comments, "comment", "comments")) }
      { MetaStatsRow("bell-o", updates + " " + pluralizer(updates, "status update", "status updates")) }

      <p className="small-text">
        <em>These statistics are not shown to anyone else but you.</em>
      </p>

    </div>
  );
}

export const GiveawayMetaCard = (props) => (
  <PaperCard className="giveaway">
    <div className="flex-row">
      <div className="col col-xs-12">
        { props.ga.userId == Meteor.userId() ? MetaInfo(props) : AboutAuthor(props) }
      </div>
    </div>
  </PaperCard>
);
