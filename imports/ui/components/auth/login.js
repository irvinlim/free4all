import React from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { handleLogin, handleFacebookLogin, handleGoogleLogin } from '../../../modules/login';

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
        contentStyle={{ maxWidth: 550 }}>
        <form ref="login" className="login" onSubmit={ this.handleSubmit }>
          <Grid fluid={true}>
            <Row>
              <Col>
                <h3 style={{ textAlign: 'center' }}>Login to Free4All</h3>
              </Col>
            </Row>
            <Row className="openid" style={{ marginBottom: 20 }}>
              <Col xs={12} sm={4}>
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#ff8c00" }}
                  labelColor="#ffffff"
                  label="NUS OpenID" />
              </Col>
              <Col xs={12} sm={4}>
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#395697" }} l
                  abelColor="#ffffff"
                  label="Facebook"
                  icon={ <i className="fa fa-facebook-f"></i> }
                  onTouchTap={ this.socialLoginHandler(handleFacebookLogin) } />
              </Col>
              <Col xs={12} sm={4}>
                <FlatButton
                  style={{ width: "100%", backgroundColor: "#e0492f" }}
                  labelColor="#ffffff"
                  label="Google"
                  icon={ <i className="fa fa-google"></i> }
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
              <Col xs={ 6 }>
                <TextField
                  type="email"
                  ref="emailAddress"
                  name="emailAddress"
                  hintText="Email Address"
                  errorText={ this.state.errors.emailAddress }
                />
              </Col>
              <Col xs={ 6 }>
                <p style={{ fontSize: 13, lineHeight: "48px", textAlign: 'right' }}>Not yet a member? <Link to="/signup">Sign up</Link></p>
              </Col>
            </Row>
            <Row>
              <Col xs={ 6 }>
                <TextField
                  type="password"
                  ref="password"
                  name="password"
                  hintText="Password"
                  errorText={ this.state.errors.password }
                />
              </Col>
              <Col xs={ 6 }>
                <p style={{ fontSize: 13, lineHeight: "48px", textAlign: 'right' }}><Link to="/recover-password">Forgot Password?</Link></p>
              </Col>
            </Row>
            <Row>
              <Col xs={ 12 }>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <RaisedButton type="submit" fullWidth={true} primary={true} label="Login" />
              </Col>
            </Row>
          </Grid>
        </form>
      </Dialog>
    );
  }
}
