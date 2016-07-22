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

import { insertComment, editComment, removeComment, flagComment } from '../../../api/giveaway-comments/methods';

const middot = <span>&nbsp;&middot;&nbsp;</span>;

const CommentsList = (self, comments, owner) => (
  <Scrollbars
    autoHide
    autoHeight
    autoHeightMin={1}
    autoHeightMax={500}>
    { comments.map(CommentRow(self, owner)) }
  </Scrollbars>
);

const CommentRow = (self, owner) => (comment, index) => (
  <div className="comment-row" key={index}>
    { self.state.currentlyEditing && self.state.currentlyEditing == comment._id ?
      CommentRowEditing(self, comment, owner) :
      CommentRowDisplay(self, comment, owner)
    }
  </div>
);

const CommentRowDisplay = (self, { _id, content, user, createdAt, updatedAt }, owner) => LayoutHelper.twoColumns(
  UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "flex" }),
  <div className="comment-body">
    <h5 className="comment-username">{ UsersHelper.getFullNameWithLabelIfEqual(user, owner, "Author") }</h5>
    { GiveawaysHelper.commentBody(content) }
    <p className="timestamp small-text">
      { updatedAt ? "updated " + moment(updatedAt).fromNow() : moment(createdAt).fromNow() }
      { Meteor.userId() ?
        user && user._id === Meteor.userId() ? CommentActionsOwner(self, _id, content) : CommentActionsNonOwner(self, _id, content) :
        null
      }
    </p>
  </div>,
  40
);

const CommentActionsOwner = (self, _id, content) => (
  <span>
    { middot }
    <a role="button" onTouchTap={ event => self.setState({ currentlyEditing: _id, editCommentValue: content }) }>Edit</a>
    { middot }
    <a role="button" onTouchTap={ event => self.handleRemoveComment(_id) }>Remove</a>
  </span>
);

const CommentActionsNonOwner = (self, _id, content) => (
  <span>
    { middot }
    <a role="button" onTouchTap={ event => self.handleFlagComment(_id) }>Flag</a>
  </span>
);

const CommentRowEditing = (self, { _id, content, user, createdAt, updatedAt }, owner) => LayoutHelper.twoColumns(
  UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "flex" }),
  <div className="comment-body">
    <h5 className="comment-username">{ UsersHelper.getFullNameWithLabelIfEqual(user, owner, "Author") }</h5>
    <TextField
      id="edit-comment-field"
      name="edit-comment"
      value={ self.state.editCommentValue }
      onChange={ event => self.setState({ editCommentValue: event.target.value }) }
      multiLine={true}
      fullWidth={true}
      hintText="Add a comment..."
      hintStyle={{ fontSize: 14 }}
      textareaStyle={{ fontSize: 14 }} />
    <p className="small-text">
      <a role="button" onTouchTap={ self.handleEditComment.bind(self) }>Save</a>
      { middot }
      <a role="button" onTouchTap={ event => self.setState({ currentlyEditing: null }) }>Cancel</a>
    </p>
  </div>,
  40
);

const NoComments = () => (
  <p>
    <em>No comments yet. { Meteor.user() ? "Add yours?" : "Login to comment!" }</em>
  </p>
);

const AddComments = (self) => (
  <div>
    <Divider style={{ marginTop: 15 }} />

    <div className="add-comment-form">
      { LayoutHelper.threeColumns(
          UsersHelper.getAvatar(Meteor.user(), 40, { margin: "6px auto", display: "flex" }),
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
  </div>
);

export class GiveawayCommentsCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ga: null,
      addCommentValue: "",
      currentlyEditing: null,
      editCommentValue: "",
    };
  }

  handleInsertComment(event) {
    const content = this.state.addCommentValue;
    const userId = Meteor.userId();
    const giveawayId = this.state.ga._id;

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

  handleEditComment(event) {
    const content = this.state.editCommentValue;
    const _id = this.state.currentlyEditing;
    const userId = Meteor.userId();

    if (!content.length || !userId)
      return false;

    this.setState({ editCommentValue: "", currentlyEditing: null });

    editComment.call({ _id, content, userId }, (error) => {
      if (error) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Comment updated.', 'success');
      }
    });
  }

  handleRemoveComment(_id) {
    const userId = Meteor.userId();

    if (!_id)
      return false;

    removeComment.call({ _id, userId }, (error) => {
      if (error) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Comment removed.', 'success');
      }
    });
  }

  handleFlagComment(_id) {
    const userId = Meteor.userId();

    if (!_id)
      return false;

    flagComment.call({ _id, userId }, (error) => {
      if (error) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Thanks for flagging, we will be reviewing the comment shortly.', 'success');
      }
    });
  }

  componentWillMount() {
    this.setState({ ga: this.props.ga });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.currentlyEditing && !!this.state.currentlyEditing)
      $("#edit-comment-field").focus();
  }

  render() {
    const { ga, comments, owner } = this.props;

    return (
      <Paper className="giveaway giveaway-card">
        <div className="flex-row">
          <div className="col col-xs-12">
            <h3>Comments</h3>

            <div className="comments-list">
              { comments.length ? CommentsList(this, comments, owner) : NoComments() }
            </div>

            { Meteor.user() ? AddComments(this) : null }

          </div>
        </div>
      </Paper>
    );
  }
}
