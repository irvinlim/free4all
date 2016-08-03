import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import loginDialogOpen from './loginDialogOpen';

const rootReducer = combineReducers({
  loginDialogOpen,
  routing: routerReducer
});

export default rootReducer;
