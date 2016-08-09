import React from 'react';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Loading } from '../loading';
import { Alert } from 'react-bootstrap';

import { joinCommunity, setHomeCommunity } from '../../../api/users/methods';
import { handleLogin, handleFacebookLogin, handleGoogleLogin, handleIVLELogin } from '../../../modules/login';

import * as IconsHelper from '../../../util/icons';

const updateHomeCommunityFromSession = () => {
  const homeLocationSession = Session.get("homeLocation");

  if (homeLocationSession && !Meteor.user().homeLocation) {
    // Join community
    joinCommunity.call({ userId: Meteor.userId(), commId: homeLocationSession.commId });

    // Set as Home Community if not already set
    if (homeLocationSession && !Meteor.user().profile.homeCommunityId)
      setHomeCommunity.call({
        userId: Meteor.userId(),
        community: {
          _id: homeLocationSession.commId,
          coordinates: homeLocationSession.coordinates,
          zoom: homeLocationSession.zoom,
        },
      });
  }
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      loadingLogin: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    const self = this;

    // Necessary because the real DOM hasn't been updated at this point, only the virtual DOM. lol....
    if (prevProps.open != this.props.open)
      setTimeout(() => {
        self.setState({ errors: {} });

        handleLogin({
          component: self,
          clearErrors() {
            self.setState({ errors: {} });
          },
          setError(er, text) {
            let errorsObject = {};
            errorsObject[er] = text;
            errorsObject = $.extend({}, self.state.errors, errorsObject);
            self.setState({ errors: errorsObject });
          },
          afterLogin() {
            updateHomeCommunityFromSession();
            self.props.closeLogin();
          },
          finishedLogin() {

          },
        });
      });
  }

  socialLoginHandler(handler) {
    const self = this;

    return (event) => {
      $(event.target).closest(".container-fluid").addClass('container-loading');
      self.setState({ loadingLogin: true });

      handler({
        afterLogin() {
          updateHomeCommunityFromSession();
          self.props.closeLogin();
        },
        finishedLogin() {
          $(event.target).closest(".container-fluid").removeClass('container-loading');
          self.setState({ loadingLogin: false });
        },
      });
    };
  }

  render() {
    return (
      <Dialog
        className="dialog login-dialog"
        open={ this.props.open }
        onRequestClose={ this.props.closeLogin }
        contentStyle={{ maxWidth: 550 }}
        autoScrollBodyContent={true}>
        <form ref="login" className="login" onSubmit={ this.handleSubmit }>
          <div className="container-fluid">

            { this.props.message ?
                <div className="flex-row">
                  <div className="col col-xs-12 nopad">
                    <Alert className="login-dialog-message" bsStyle="warning">
                      { this.props.message }
                    </Alert>
                  </div>
                </div>
              : null
            }

            <div className="flex-row">
              <div className="col col-xs-12 nopad">
                <h3 style={{ textAlign: 'center' }}>Login to Free4All</h3>
              </div>
            </div>

            <div className="flex-row nopad openid" style={{ marginBottom: 10 }}>
              <div className="col col-xs-12 col-sm-4">
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#ff8c00", marginBottom: 10 }}
                  label="NUS OpenID"
                  onTouchTap={ this.socialLoginHandler(handleIVLELogin) } />
              </div>
              <div className="col col-xs-12 col-sm-4">
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#395697", marginBottom: 10 }}
                  label="Facebook"
                  icon={ IconsHelper.icon("fa fa-facebook-f") }
                  onTouchTap={ this.socialLoginHandler(handleFacebookLogin) } />
              </div>
              <div className="col col-xs-12 col-sm-4">
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#e0492f", marginBottom: 10 }}
                  label="Google"
                  icon={ IconsHelper.icon("fa fa-google") }
                  onTouchTap={ this.socialLoginHandler(handleGoogleLogin) } />
              </div>
            </div>

            <div className="flex-row">
              <div className="col col-xs-12 nopad">
                <div className="divider-with-text">
                  <hr />
                  <span>OR</span>
                </div>
              </div>
            </div>

            <div className="flex-row nopad">
              <div className="col col-xs-12 col-sm-6">
                <TextField
                  type="email"
                  ref="emailAddress"
                  name="emailAddress"
                  hintText="Email Address"
                  errorText={ this.state.errors.emailAddress }
                  fullWidth={true}
                />
                <TextField
                  type="password"
                  ref="password"
                  name="password"
                  hintText="Password"
                  errorText={ this.state.errors.password }
                  fullWidth={true}
                />
              </div>
              <div className="col col-xs-12 col-sm-6">
                <p style={{ fontSize: 13, textAlign: 'right', marginTop: 20 }}>
                  Not yet a member? <Link to="/signup" onTouchTap={ this.props.closeLogin }>Sign up</Link>
                </p>
                <p style={{ fontSize: 13, textAlign: 'right' }}>
                  <Link to="/recover-password" onTouchTap={ this.props.closeLogin }>Forgot Password?</Link>
                </p>
              </div>
            </div>
            <div className="flex-row nopad" style={{ marginTop: 20 }}>
              <div className="col col-xs-6 col-xs-offset-3 col-sm-3 col-sm-offset-9">
                <RaisedButton type="submit" style={{ width: "100%" }} primary={true} label="Login" />
              </div>
            </div>
          </div>

          <Loading containerClassName="floating-loading" containerStyle={{ display: this.state.loadingLogin ? 'flex' : 'none' }} />
        </form>
      </Dialog>
    );
  }
}
