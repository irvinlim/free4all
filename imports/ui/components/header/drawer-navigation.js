import React from 'react';
import Drawer from 'material-ui/Drawer';
import DrawerMenuItems from '../../containers/drawer-menu-items';

export default class DrawerNavigation extends React.Component {
  componentDidMount() {
    // iubenda Privacy Policy
    (function(w, d) {
      var loader = function() {
        var s = d.createElement("script"),
          tag = d.getElementsByTagName("script")[0];
        s.src = "//cdn.iubenda.com/iubenda.js";
        tag.parentNode.insertBefore(s, tag);
      };

      if (w.addEventListener) {
        w.addEventListener("load", loader, false);
      } else if (w.attachEvent) {
        w.attachEvent("onload", loader);
      } else {
        w.onload = loader;
      }
    })(window, document);
  }

  render() {
    return (
      <Drawer docked={ false } width={ 250 } open={ this.props.isOpen } onRequestChange={ isOpen => this.props.setDrawerOpen(isOpen) }>
        <DrawerMenuItems closeDrawer={ this.props.closeDrawer } openLogin={ this.props.openLogin } />

        <div className="iubenda-button">
          <a href="//www.iubenda.com/privacy-policy/7885534" className="iubenda-white iubenda-embed" title="Privacy Policy">Privacy Policy</a>
        </div>
      </Drawer>
    );
  }
};

DrawerNavigation.propTypes = {
  isOpen: React.PropTypes.bool.isRequired,
  closeDrawer: React.PropTypes.func,
}
