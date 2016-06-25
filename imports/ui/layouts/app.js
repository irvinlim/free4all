import React from 'react';
import { Grid } from 'react-bootstrap';
import MuiTheme from '../layouts/mui-theme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '../components/header/header';

export const App = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },
  render() {
    return (
      <MuiThemeProvider muiTheme={ MuiTheme }>
        <div id="main">
          <Header />
          <Grid>
            { this.props.children }
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  },
});
