import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { handleLogin, handleFacebookLogin, handleGoogleLogin, handleIVLELogin } from '../../../modules/login';

import * as IconsHelper from '../../../util/icons';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
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
            self.props.closeLogin();
          },
        });
      });
  }

  socialLoginHandler(handler) {
    const self = this;

    return (event) => handler({
        afterLogin() {
          self.props.closeLogin();
        }
      });
  }

  render() {
    return (
      <Dialog
        open={ this.props.open }
        onRequestClose={ this.props.closeLogin }
        contentStyle={{ maxWidth: 550 }}
        autoScrollBodyContent={true}>
        <form ref="login" className="login" onSubmit={ this.handleSubmit }>
          <Grid fluid={true}>
            <Row>
              <Col>
                <h3 style={{ textAlign: 'center' }}>Login to Free4All</h3>
              </Col>
            </Row>
            <Row className="openid" style={{ marginBottom: 10 }}>
              <Col xs={12} sm={4} smOffset={0}>
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#ff8c00", marginBottom: 10 }}
                  labelColor="#ffffff"
                  label="NUS OpenID"
                  onTouchTap={ this.socialLoginHandler(handleIVLELogin) } />
              </Col>
              <Col xs={12} sm={4} smOffset={0}>
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#395697", marginBottom: 10 }}
                  labelColor="#ffffff"
                  label="Facebook"
                  icon={ IconsHelper.icon("fa fa-facebook-f") }
                  onTouchTap={ this.socialLoginHandler(handleFacebookLogin) } />
              </Col>
              <Col xs={12} sm={4} smOffset={0}>
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#e0492f", marginBottom: 10 }}
                  labelColor="#ffffff"
                  label="Google"
                  icon={ IconsHelper.icon("fa fa-google") }
                  onTouchTap={ this.socialLoginHandler(handleGoogleLogin) } />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="divider-with-text">
                  <hr />
                  <span>OR</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={6}>
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
              </Col>
              <Col xs={12} sm={6}>
                <p style={{ fontSize: 13, textAlign: 'right', marginTop: 20 }}>Not yet a member? <Link to="/signup">Sign up</Link></p>
                <p style={{ fontSize: 13, textAlign: 'right' }}><Link to="/recover-password">Forgot Password?</Link></p>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col xs={6} xsOffset={3} sm={3} smOffset={9}>
                <RaisedButton type="submit" style={{ width: "100%" }} primary={true} label="Login" />
              </Col>
            </Row>
          </Grid>
        </form>
      </Dialog>
    );
  }
}
