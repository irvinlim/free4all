import React from 'react';
import { Meteor } from 'meteor/meteor';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Scrollbars } from 'react-custom-scrollbars';

import * as GiveawaysHelper from '../../../util/giveaways';
import * as UsersHelper from '../../../util/users';
import * as LayoutHelper from '../../../util/layout';

import { insertComment } from '../../../api/giveaway-comments/methods';

const CommentsList = (comments, owner) => (
  <Scrollbars
    autoHide
    autoHeight
    autoHeightMin={1}
    autoHeightMax={500}>
    { comments.map(CommentRow(owner)) }
  </Scrollbars>
);

const CommentRow = (owner) => ({ content, user, createdAt }, index) => (
  <div className="comment-row" key={index}>
    { LayoutHelper.twoColumns(
        UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "flex" }),
        <div className="comment-body">
          <h5 className="comment-username">{ UsersHelper.getFullNameWithLabelIfEqual(user, owner, "Author") }</h5>
          { GiveawaysHelper.commentBody(content) }
          <p className="timestamp small-text">{ moment(createdAt).fromNow() }</p>
        </div>,
        40
      ) }
  </div>
);

const NoComments = () => {
  const cta = Meteor.user() ? "Add yours?" : "Login to comment!";

  return (
    <p>
      <em>No comments yet. { cta }</em>
    </p>
  );
}

export class GiveawayCommentsCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ga: null,
      addCommentValue: ""
    };
  }

  handlePostComment(event) {
    const content = this.state.addCommentValue;
    const userId = Meteor.userId();
    const giveawayId = this.state.ga._id;

    if (!content.length || !userId)
      return false;

    this.setState({ addCommentValue: "" });

    insertComment.call({ giveawayId, content, userId }, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Comment added.', 'success');
      }
    });
  }

  AddComments() {
    return (
      <div>
        <Divider style={{ marginTop: 15 }} />

        <div className="add-comment-form">
          { LayoutHelper.threeColumns(
              UsersHelper.getAvatar(Meteor.user(), 40, { margin: "6px auto", display: "flex" }),
              <TextField
                id="add-comment-field"
                name="add-comment"
                value={ this.state.addCommentValue }
                onChange={ event => this.setState({ addCommentValue: event.target.value }) }
                multiLine={true}
                fullWidth={true}
                underlineShow={false}
                hintText="Add a comment..."
                hintStyle={{ fontSize: 14 }}
                textareaStyle={{ fontSize: 14 }} />,
              <FlatButton onTouchTap={ this.handlePostComment.bind(this) } label="Post" style={{ margin: "6px auto" }} />,
              40
            ) }
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.setState({ ga: this.props.ga });
  }

  render() {
    const { ga, comments, owner } = this.props;

    return (
      <Paper className="giveaway giveaway-card">
        <div className="flex-row">
          <div className="col col-xs-12">
            <h3>Comments</h3>

            <div className="comments-list">
              { comments.length ? CommentsList(comments, owner) : NoComments() }
            </div>

            { Meteor.user() ? this.AddComments() : null }

          </div>
        </div>
      </Paper>
    );
  }
}
