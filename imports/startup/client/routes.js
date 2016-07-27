import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { App } from '../../ui/layouts/app';

import { Index } from '../../ui/pages/index';
import { NotFound } from '../../ui/pages/not-found';
import { Bert } from 'meteor/themeteorchef:bert';

import { logPageView } from '../../util/analytics';
import * as RolesHelper from '../../util/roles';

// Auth
import { RecoverPassword } from '../../ui/pages/recover-password';
import { ResetPassword } from '../../ui/pages/reset-password';
import { Signup } from '../../ui/pages/signup';

// Timeline
import { Timeline } from '../../ui/pages/timeline';
import { Giveaway } from '../../ui/pages/giveaway';

// Communities
import { Community } from '../../ui/pages/community';
import { Communities } from '../../ui/pages/communities';
import { MyCommunities } from '../../ui/pages/my-communities';

// MyGiveaways
import { MyGiveaways } from '../../ui/pages/my-giveaways';

// Profile & Settings
import { Profile } from '../../ui/pages/profile';
import { Settings } from '../../ui/pages/settings';

// Manage
import { ManageCategories } from '../../ui/pages/manage/manage-categories';
import { ManageParentCategories } from '../../ui/pages/manage/manage-parent-categories';
import { ManageStatusTypes } from '../../ui/pages/manage/manage-status-types';

const sub = Meteor.subscribe('user-data');

const alertNoAuth = (title) => {
  Meteor.setTimeout(function(){
    Bert.alert({
      title: title,
      type: 'danger',
      style: 'growl-top-right',
      icon: 'fa-user'
    });
  }, 1000);
}

const requireAuth = (nextState, replace) => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });

    switch (nextState.location.pathname) {
      case "/my-giveaways":
        alertNoAuth("Log in to access your giveaways!");
        break;

      case "/my-communities":
        alertNoAuth("Log in to access your communities!");
        break;
    }
  }
};

const requireModsAdmins = (nextState, replace) => {
  if (!sub.ready())
    return setTimeout(() => requireModsAdmins(nextState, replace), 100);

  if (!RolesHelper.modsOrAdmins(Meteor.userId())) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

const authRedirect = (nextState, replace) => {
  if (Meteor.userId()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname },
    });
  }
};

Meteor.startup(() => {
  render(
    <Router history={ browserHistory } onUpdate={ logPageView }>
      <Route path="/" component={ App }>
        <IndexRoute component={ Index } />
        <Route name="login" path="login" component={ Index } onEnter={ authRedirect } />

        <Route name="recover-password" path="recover-password" component={ RecoverPassword } onEnter={ authRedirect } />
        <Route name="reset-password" path="reset-password/:token" component={ ResetPassword } onEnter={ authRedirect } />
        <Route name="signup" path="signup" component={ Signup } onEnter={ authRedirect } />

        <Route name="timeline" path="timeline" component={ Timeline } />
        <Route name="giveaway" path="giveaway/:id" component={ Giveaway } />
        <Route name="my-giveaways" path="my-giveaways" component={ MyGiveaways } onEnter={ requireAuth } />

        <Route name="communities" path="communities" component={ Communities } />
        <Route name="community" path="community/:id" component={ Community } />
        <Route name="my-communities" path="my-communities" component={ MyCommunities } onEnter={ requireAuth } />

        <Route name="manage" path="manage" onEnter={ requireModsAdmins }>
          <Route name="categories" path="categories" component={ ManageCategories } />
          <Route name="parent-categories" path="parent-categories" component={ ManageParentCategories } />
          <Route name="status-types" path="status-types" component={ ManageStatusTypes } />
        </Route>

        <Route name="profile" path="profile(/:userId)" component={ Profile } onEnter={ requireAuth } />
        <Route name="settings" path="settings" component={ Settings } onEnter={ requireAuth } />

        <Route path="*" component={ NotFound } />
        </Route>
    </Router>,
    document.getElementById('react-root')
  );
});
