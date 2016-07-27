import { Meteor } from 'meteor/meteor';
import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import PaperCard from '../../layouts/paper-card';

import * as UsersHelper from '../../../util/users';

import ShareItWrapper from './shareit-wrapper';

export const GiveawaySharingCard = ({ ga }) => (
  <PaperCard className="giveaway">
    <div className="flex-row">
      <div className="col col-xs-12">
        <h3>Share</h3>
        <TextField
          id="share-url"
          fullWidth={true}
          inputStyle={{ fontSize: "12px" }}
          value={ Meteor.absoluteUrl('giveaway/' + ga._id) }
          onTouchTap={ () => $("#share-url").select() } />
        <ShareItWrapper ga={ga} />
      </div>
    </div>
  </PaperCard>
);
