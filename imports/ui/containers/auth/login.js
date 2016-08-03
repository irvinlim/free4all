import React from 'react';
import { connect } from 'react-redux';
import Login from '../../components/auth/login';

const mapStateToProps = (state) => {
  return {
    open: state.loginDialogOpen,
    message: state.loginDialogMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    closeLogin: () => dispatch({ type: 'CLOSE_LOGIN_DIALOG' }),
  };
};

const LoginDialog = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginDialog;
