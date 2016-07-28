import React from 'react';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import { Accounts } from 'meteor/accounts-base';

import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import LinearProgress from 'material-ui/LinearProgress';
import Formsy from 'formsy-react';

import * as Colors from 'material-ui/styles/colors';
import * as UsersHelper from '../../../util/users';
import * as IconsHelper from '../../../util/icons';
import * as LayoutHelper from '../../../util/layout';
import * as FormsHelper from '../../../util/forms';

import { updateProfileSettings, updatePassword } from '../../../api/users/methods';
import { linkFacebook, linkGoogle, linkIVLE, unlinkFacebook, unlinkGoogle, unlinkIVLE } from '../../../modules/link-accounts';

const uploadFileStyle = {
  cursor: 'pointer',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  width: '100%',
  opacity: 0,
  zIndex: 1,
};

export class FormSettings extends React.Component {
  constructor(props) {
    super(props);

    const user = this.props.user;

    this.state = {
      errors: {},
      submitProfile: false,
      submitPassword: false,

      avatarUrl: UsersHelper.getAvatarUrl(user, 240),
      name: user.profile.name,
      gender: user.profile.gender,
      birthday: user.profile.birthday,
      bio: user.profile.bio,

      loadingFile: false,
      avatarId: null,
    };
  }

  handleSaveProfile(event) {
    const { gender, name, birthday, bio, avatarId } = this.state;

    updateProfileSettings.call({ _id: Meteor.userId(), name, gender, birthday, bio, avatarId }, function(error) {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Profile updated.', 'success');
      }
    });
  }

  handleSavePassword(event) {
    const self = this;
    const { oldpassword, newpassword, newpassword2 } = this.state;

    if (newpassword !== newpassword2)
      Bert.alert("Passwords do not match.", 'danger');

    // Update password
    Accounts.changePassword(oldpassword, newpassword, function(error) {
      if (error) {
        if (error.error == 403)
          Bert.alert("Your old password is incorrect.", 'danger');
        else
          Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Password updated.', 'success');

        self.setState({ submitPassword: false, oldpassword: "", newpassword: "", newpassword2: "" }, () => {
          self.refs.oldpassword.setState({ value: "" });
          self.refs.newpassword.setState({ value: "" });
          self.refs.newpassword2.setState({ value: "" });
          self.refs.passwordSettings.validateForm();
        });
      }
    });
  }

  handleUpload(event) {
    const self = this;
    const files = event.currentTarget.files;

    this.setState({ loadingFile: true });

    Cloudinary.upload(files, {}, function(err, res) {
      self.setState({ avatarId: res.public_id, loadingFile : false, avatarUrl: res.secure_url });
    });
  }

  handleFacebook(event) {
    if (UsersHelper.hasFacebookService(Meteor.user()))
      unlinkFacebook();
    else
      linkFacebook();
  }

  handleGoogle(event) {
    if (UsersHelper.hasGoogleService(Meteor.user()))
      unlinkGoogle();
    else
      linkGoogle();
  }

  handleIVLE(event) {
    if (UsersHelper.hasIVLEService(Meteor.user()))
      unlinkIVLE();
    else
      linkIVLE();
  }

  render() {
    const avatar = this.state.avatarUrl ?
      <Avatar className="avatar" size={240} src={ this.state.avatarUrl } /> :
      <Avatar className="avatar" size={240} icon={ IconsHelper.materialIcon("person", { color: Colors.grey50 }) } />;
    const uploadButton = (
      <FlatButton label="Upload New Picture" style={{ display: "block", margin: "0 auto" }}>
        <input type="file" style={ uploadFileStyle } onChange={ this.handleUpload.bind(this) } />
      </FlatButton>
    );

    const user = Meteor.user();

    const err = (msg) => this.state.submitProfile ? msg : "";
    const erm = (msg) => this.state.submitPassword ? msg : "";

    return (
      <div className="form-settings">
        <div className="flex-row">

          <div className="col col-xs-12 nopad">
            <Formsy.Form
              id="profileSettings"
              ref="profileSettings"
              className="profile-settings"
              onSubmit={ (data, resetForm, invalidateForm) => this.setState({ submitProfile: true }, this.refs.profileSettings.validateForm) }
              onValidSubmit={ this.handleSaveProfile.bind(this) }>
              <Card className="form-box">
                <CardTitle title="Update Profile" subtitle="We want to know more about you!" />

                <CardText>

                  <div className="flex-row">
                    <div className="col col-xs-12 col-sm-4">
                      <div className="avatar-upload" style={{ textAlign: "center" }}>
                        { avatar }
                      </div>
                      { uploadButton }
                    </div>

                    <div className="col col-xs-12 col-sm-8">
                      { FormsHelper.makeTextField({ self: this, name: "name", label: "Name", required: true, validationErrors: { isDefaultRequiredValue: err("Please enter your name.") } }) }
                      { FormsHelper.makeSelectField({ self: this, name: "gender", label: "Gender", required: true, validationError: err("Please enter your gender."), items: { Male: "Male", Female: "Female", Others: "Others" } }) }
                      { FormsHelper.makeBirthdayDatePicker({ self: this, name: "birthday", label: "Birthday", required: true, validationError: err("Please enter your birthday.") }) }
                      { FormsHelper.makeMultiTextField({ self: this, name: "bio", label: "Bio", hintText: "Tell us a little about yourself." }) }
                    </div>
                  </div>

                  { this.state.loadingFile ? <LinearProgress mode="indeterminate" /> : null }
                </CardText>

                <CardActions style={{ textAlign: "right" }}>
                  <FlatButton formNoValidate type="submit" label="Save" />
                </CardActions>
              </Card>
            </Formsy.Form>
          </div>
        </div>

        { UsersHelper.hasPasswordService(user) ?
          <div className="flex-row">
            <div className="col col-xs-12 nopad">
              <Formsy.Form
                id="passwordSettings"
                ref="passwordSettings"
                className="password-settings"
                onSubmit={ (data, resetForm, invalidateForm) => resetForm() || this.setState({ submitPassword: true }, this.refs.passwordSettings.validateForm) }
                onValidSubmit={ this.handleSavePassword.bind(this) }>
                <Card className="form-box">
                  <CardTitle title="Change Password" subtitle="Leave empty if you do not wish to change or set your password." />

                  <CardText>
                    { FormsHelper.makePasswordField({ self: this, name: "oldpassword", label: "Old Password", required: true, validationErrors: { isDefaultRequiredValue: erm("Please enter your old password.") } }) }
                    { FormsHelper.makePasswordField({ self: this, name: "newpassword", label: "New Password", validations: "minLength:6", required: true, validationError: erm("Your new password must be at least six characters long."), validationErrors: { isDefaultRequiredValue: erm("Please enter a new password.") } }) }
                    { FormsHelper.makePasswordField({ self: this, name: "newpassword2", label: "Confirm Password", validations: "equalsField:newpassword", required: true, validationError: erm("Passwords do not match."), validationErrors: { isDefaultRequiredValue: erm("Please confirm your new password.") } }) }
                  </CardText>

                  <CardActions style={{ textAlign: "right" }}>
                    <FlatButton formNoValidate type="submit" label="Save" />
                  </CardActions>
                </Card>
              </Formsy.Form>
            </div>
          </div>
          : null
        }

        <div className="flex-row">
          <div className="col col-xs-12 nopad">
            <Card className="form-box login">
              <CardTitle title="OAuth Accounts" subtitle="Associate your external accounts for easy login." />

              <CardText className="openid">
                <FlatButton
                  style={{ backgroundColor: "#395697", margin: "0 10px" }}
                  label={ UsersHelper.hasFacebookService(user) ? "Unlink Facebook" : "Link Facebook" }
                  icon={ IconsHelper.icon("fa fa-facebook-f") }
                  onTouchTap={ this.handleFacebook } />
                <FlatButton
                  style={{ backgroundColor: "#e0492f", margin: "0 10px" }}
                  label={ UsersHelper.hasGoogleService(user) ? "Unlink Google" : "Link Google" }
                  icon={ IconsHelper.icon("fa fa-google") }
                  onTouchTap={ this.handleGoogle } />
                <FlatButton
                  style={{ backgroundColor: "#ff8c00", margin: "0 10px" }}
                  label={ UsersHelper.hasIVLEService(user) ? "Unlink NUS OpenID" : "Link NUS OpenID" }
                  onTouchTap={ this.handleIVLE } />
              </CardText>
            </Card>
          </div>
        </div>

      </div>
    );
  }
}
