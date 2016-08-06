import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { Link } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';

import GiveawayInfoboxContent from '../../containers/giveaways/giveaway-infobox-content';
import GiveawayRatings from '../../containers/giveaways/giveaway-ratings';
import GiveawayComments from '../../containers/giveaways/giveaway-comments';

import * as GiveawaysHelper from '../../../util/giveaways';
import * as IconsHelper from '../../../util/icons';
import { Giveaways } from '../../../api/giveaways/giveaways';

export default class MapInfoBox extends React.Component {

  componentDidMount() {
    const self = this;
    $("#map-info-box").click(event => {
      self.props.setBoxState(2);
    });

    $("#map-info-box .close-button").click(event => {
      event.stopPropagation();

      $("#map-info-box div").scrollTop(0);

      if (self.props.boxState == 1)
        self.props.setBoxState(0);
      else if (self.props.boxState == 2)
        self.props.setBoxState(1);
    });

    $(".expand-button-infobox").click(event => {
      event.stopPropagation();

      if (self.props.boxState == 0 && this.props.gaId)
        self.props.setBoxState(2);
      else
        self.props.setBoxState(0);
    });
  }

  render() {
    const { gaId, boxState } = this.props;
    const ga = Giveaways.findOne(gaId);

    return (
      <div id="map-info-box" className={ `map-sidebar giveaway col-xs-12 col-sm-6 col-md-3 col-lg-3 state-${boxState}` }>
        <Scrollbars className="scrollbar-container" autoHide style={{ height: "100%" }}>
          <div className="map-sidebar-box">
            <GiveawayInfoboxContent gaId={ gaId } />

            <div className="action-buttons">
              <Link className="button" to={ "/giveaway/" + gaId }>
                <FlatButton label="View Giveaway" />
              </Link>

              { GiveawaysHelper.ownerOrModsOrAdmins(ga) ?
                <Link className="button" to={ "/my-giveaways/" + gaId }>
                  <FlatButton label="Edit Giveaway" />
                </Link> : null
              }
            </div>
          </div>

          <div className="map-sidebar-box">
            <h3>User Reviews</h3>
            <GiveawayRatings gaId={ gaId } />
          </div>

          <div className="map-sidebar-box">
            <h3>Comments</h3>
            <GiveawayComments gaId={ gaId } showActions={false} />

            <div className="action-buttons">
              <Link className="button" to={ "/giveaway/" + gaId }>
                <FlatButton label="Post a Comment" />
              </Link>
            </div>
          </div>
        </Scrollbars>

        <div className="close-button hidden-sm hidden-md hidden-lg">
          { IconsHelper.icon("close") }
        </div>

        <div className="expand-button-infobox hidden-xs">
          <FloatingActionButton mini={true} backgroundColor="#647577" zDepth={ 0 }>
            { IconsHelper.icon(boxState == 0 ? "keyboard_arrow_right" : "keyboard_arrow_left") }
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

