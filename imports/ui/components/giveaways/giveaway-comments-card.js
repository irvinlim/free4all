import React from 'react';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Scrollbars } from 'react-custom-scrollbars';
import PaperCard from '../../layouts/paper-card';

import * as GiveawaysHelper from '../../../util/giveaways';
import * as UsersHelper from '../../../util/users';
import * as LayoutHelper from '../../../util/layout';

import GiveawayComments from '../../containers/giveaways/giveaway-comments';
import { insertComment } from '../../../api/giveaway-comments/methods';

const AddComments = (self) => (
  <div className="add-comment-form">
    { LayoutHelper.threeColumns(
        UsersHelper.getAvatar(Meteor.user(), 40, { margin: "6px auto", display: "block" }),
        <TextField
          id="add-comment-field"
          name="add-comment"
          value={ self.state.addCommentValue }
          onChange={ event => self.setState({ addCommentValue: event.target.value }) }
          multiLine={true}
          fullWidth={true}
          underlineShow={false}
          hintText="Add a comment..."
          hintStyle={{ fontSize: 14 }}
          textareaStyle={{ fontSize: 14 }} />,
        <FlatButton onTouchTap={ self.handleInsertComment.bind(self) } label="Post" style={{ margin: "6px auto" }} />,
        40
      ) }
  </div>
);

const LoginToAddComment = (self) => (
  <div className="add-comment-form">
    <em className="small-text">Login to add a comment!</em>
  </div>
);

export class GiveawayCommentsCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      addCommentValue: "",
    };
  }

  handleInsertComment(event) {
    const content = this.state.addCommentValue;
    const userId = Meteor.userId();
    const giveawayId = this.props.gaId;

    if (!content.length || !userId)
      return false;

    this.setState({ addCommentValue: "" });

    insertComment.call({ giveawayId, content, userId }, (error) => {
      if (error) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Comment added.', 'success');
      }
    });
  }

  render() {
    return (
      <PaperCard className="giveaway">
        <div className="flex-row">
          <div className="col col-xs-12">
            <h3>Comments</h3>

            <GiveawayComments gaId={ this.props.gaId } showActions={true} />

            <Divider style={{ marginTop: 15 }} />

            { Meteor.user() ? AddComments(this) : LoginToAddComment(this) }

          </div>
        </div>
      </PaperCard>
    );
  }
}
