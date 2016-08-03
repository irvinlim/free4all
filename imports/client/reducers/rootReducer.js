import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import loginDialogOpen from './loginDialogOpen';
import loginDialogMessage from './loginDialogMessage';

const rootReducer = combineReducers({
  loginDialogOpen,
  loginDialogMessage,
  routing: routerReducer
});

export default rootReducer;
