import { Meteor } from 'meteor/meteor';
import React from 'react';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import PaperCard from '../../layouts/paper-card';

import * as Colors from 'material-ui/styles/colors';
import * as Helper from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as AvatarHelper from '../../../util/avatar';
import * as IconsHelper from '../../../util/icons';

import { flagGiveaway } from '../../../api/giveaways/methods';

let giveaway = null;

const iconRow = (icon, content) => {
  if (content)
    return (
      <div className="info-row">
        <div className="info-row-icon">
          { IconsHelper.icon(icon, { fontSize: 18, lineHeight: "25px" }) }
        </div>
        <div className="info-row-text">
          <p>{ content }</p>
        </div>
      </div>
    );
};

const flagCTA = (self) => (
  <p className="small-text">
    <em>You can bring this giveaway to moderators' attention by <a role="button" onTouchTap={ self.handleFlagGiveaway.bind(self) }>flagging</a> it.</em> <br/>
    <em>If this giveaway is a duplicate/does not exist, please flag and also leave a comment.</em>
  </p>
);

const hasFlagged = (self) => (
  <p className="small-text">
    <em>You have flagged this giveaway for moderators' attention. We will be reviewing this giveaway shortly.</em>
  </p>
);

export class GiveawaySingleCard extends React.Component {

  handleFlagGiveaway(event) {
    flagGiveaway.call({ _id: this.props.ga._id, userId: Meteor.userId() }, function(error) {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Thanks for flagging, we will be reviewing this shortly.', 'success');
      }
    });
  }

  render() {
    const ga = this.props.ga;

    return (
      <PaperCard className="giveaway giveaway-single">
        <div className="flex-row">
          <div className="col col-xs-12 col-sm-3">
            <div className="avatar">
              { GiveawaysHelper.makeAvatarLegacy(ga, 350) }
            </div>
          </div>
          <div className="col col-xs-12 col-sm-9">
            <h3 className="title">{ ga.title }</h3>
            <h5 className="category">{ GiveawaysHelper.categoryBreadcrumbs(ga) }</h5>
            <p className="description">{ GiveawaysHelper.description(ga) }</p>

            { iconRow("date_range", GiveawaysHelper.dateRange(ga)) }
            { iconRow("location_on", ga.location ) }
            { GiveawaysHelper.is_ongoing(ga) ? iconRow("info_outline", "Status: " + GiveawaysHelper.getLastOwnerStatusType(ga).label ) : null }
            { iconRow("link", Helper.makeLink(ga.website, "Website")) }

            { Meteor.userId() && ga.userId !== Meteor.userId() ?
                GiveawaysHelper.userHasFlagged(ga, Meteor.user()) ? hasFlagged(this) : flagCTA(this)
              : null }
          </div>
        </div>
      </PaperCard>
    );
  }
}
