import { createStore } from 'redux';
import rootReducer from '../../client/reducers/rootReducer';

const Store = createStore(rootReducer);

export default Store;
