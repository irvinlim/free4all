import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import { Scrollbars } from 'react-custom-scrollbars';
import Store from '../../../startup/client/redux-store';

import { pluralizer } from '../../../util/helper';
import * as GiveawaysHelper from '../../../util/giveaways';
import * as UsersHelper from '../../../util/users';
import * as RolesHelper from '../../../util/roles';
import * as LayoutHelper from '../../../util/layout';
import * as Colors from 'material-ui/styles/colors';

import { editComment, removeComment, flagComment, unflagComment, removeFlaggedComment } from '../../../api/giveaway-comments/methods';

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

const CommentRow = (self, owner) => (comment, index) => {
  const isFlaggedAndMod = RolesHelper.modsOrAdmins(Meteor.user()) && GiveawaysHelper.countTotalFlags(comment) > 0;
  return (
    <div
      className={`comment-row ${ isFlaggedAndMod ? 'comment-flagged' : '' }`}
      key={index}>
      { self.state.currentlyEditing && self.state.currentlyEditing == comment._id ?
        CommentRowEditing(self, comment, owner) :
        CommentRowDisplay(self, comment, owner)
      }
    </div>
  );
};

const CommentRowDisplay = (self, comment, owner) => {
  const { _id, content, user, createdAt, updatedAt } = comment;

  return LayoutHelper.twoColumns(
    UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "block" }),
    <div className="comment-body">
      <h5 className="comment-username">{ UsersHelper.getUserLink(user, UsersHelper.getFullNameWithLabelIfEqual(user, owner, "Author")) }</h5>
      { GiveawaysHelper.commentBody(content) }

      <p className="timestamp small-text">
        { updatedAt ? "updated " + moment(updatedAt).fromNow() : moment(createdAt).fromNow() }
        { self.props.showActions && Meteor.userId() ?
          user && user._id === Meteor.userId() ? CommentActionsOwner(self, comment) : CommentActionsNonOwner(self, comment) :
          null
        }
      </p>

      { RolesHelper.modsOrAdmins(Meteor.userId()) ? CommentActionsMod(self, comment) : null }
    </div>,
    40
  );
};

const CommentActionsOwner = (self, comment) => (
  <span>
    { middot }
    <a role="button" onTouchTap={ event => self.setState({ currentlyEditing: comment._id, editCommentValue: comment.content }) }>Edit</a>
    { middot }
    <a role="button" onTouchTap={ event => self.handleRemoveComment(comment._id) }>Remove</a>
  </span>
);

const CommentActionsNonOwner = (self, comment) => (
  <span>
    { middot }
    { !GiveawaysHelper.userHasFlaggedComment(comment, Meteor.userId()) ?
      <a role="button" onTouchTap={ event => self.handleFlagComment(comment._id) }>Flag</a> :
      "Flagged"
    }
  </span>
);

const CommentActionsMod = (self, comment) => {
  const flagCount = GiveawaysHelper.countTotalFlags(comment);

  if (flagCount > 0)
    return (
      <p className="timestamp small-text">
        flagged { flagCount } { pluralizer(flagCount, 'time', 'times') }
        { middot }
        <a role="button" onTouchTap={ event => self.handleUnflagComment(comment._id) }>Unflag</a>
        { middot }
        <a role="button" onTouchTap={ event => self.handleUnflagComment(comment._id) } style={{ color: Colors.red700 }}>Delete comment</a>
      </p>
    );
  else
    return null;
};

const CommentRowEditing = (self, { _id, content, user, createdAt, updatedAt }, owner) => LayoutHelper.twoColumns(
  UsersHelper.getAvatar(user, 40, { margin: "0 auto", display: "block" }),
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
    <em>
      <span>No comments yet. </span>
      { Meteor.user() ?
        "Add yours?" :
        <span>
          <a href="javascript:void(0);" onTouchTap={ () => Store.dispatch({ type: 'OPEN_LOGIN_DIALOG', message: "Login to leave a comment!" }) }>Login</a> to comment!
        </span>
      }
    </em>
  </p>
);

export class GiveawayComments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentlyEditing: null,
      editCommentValue: "",
    };
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
        Bert.alert('Thanks for flagging, we will be reviewing this shortly.', 'success');
      }
    });
  }

  handleUnflagComment(_id) {
    const userId = Meteor.userId();

    if (!_id)
      return false;

    unflagComment.call({ _id, userId }, (error) => {
      if (error) {
        console.log(error);
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Successfully removed all flags.', 'success');
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.currentlyEditing && !!this.state.currentlyEditing)
      $("#edit-comment-field").focus();
  }

  render() {
    return (
      <div className="giveaway comments-list">
        { this.props.comments.length ? CommentsList(this, this.props.comments, this.props.owner) : NoComments() }
      </div>
    );
  }
}
