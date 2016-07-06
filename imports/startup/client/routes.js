import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { App } from '../../ui/layouts/app';

import { Documents } from '../../ui/pages/documents';
import { Index } from '../../ui/pages/index';
import { NotFound } from '../../ui/pages/not-found';
import { Bert } from 'meteor/themeteorchef:bert';

// Auth
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { Signup } from '../../ui/pages/signup';

// Timeline
import { Timeline } from '../../ui/pages/timeline';
import { Giveaway } from '../../ui/pages/giveaway';

// MyGiveaways
import { MyGiveaways } from '../../ui/pages/my-giveaways';

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
    if(nextState.location.pathname === "/my-giveaways"){
      Meteor.setTimeout(function(){
        Bert.alert({
          title: 'Log in to access your giveaways!',
          type: 'danger',
          style: 'growl-top-right',
          icon: 'fa-user'
        });
      }, 1000)
    }
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory }>
      <Route path="/">
        <IndexRoute component={ Index } />
        <Route component={ App }>
          <Route name="recover-password" path="/recover-password" component={ RecoverPassword } />
          <Route name="reset-password" path="/reset-password/:token" component={ ResetPassword } />
          <Route name="signup" path="/signup" component={ Signup } />

          <Route name="timeline" path="/timeline" component={ Timeline } />
          <Route name="giveaway" path="/giveaway/:id" component={ Giveaway } />
          <Route name="my-giveaways" path="/my-giveaways" component={ MyGiveaways } onEnter={ requireAuth } />

          <Route path="*" component={ NotFound } />
        </Route>
      </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
