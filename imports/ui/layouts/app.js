import React from 'react';
import { Grid } from 'react-bootstrap';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Header from '../components/menu/header';

export const App = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
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
