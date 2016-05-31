import React from 'react';
import { Grid } from 'react-bootstrap';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppNavigation from '../containers/app-navigation';

export const App = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div id="main">
          <AppNavigation />
          <Grid>
            { this.props.children }
          </Grid>
        </div>
      </MuiThemeProvider>
    );
  },
});
