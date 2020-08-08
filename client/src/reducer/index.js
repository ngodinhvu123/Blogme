import loggedReducer from './loggedReducers';
import { combineReducers } from 'redux';
const allReducers = combineReducers({
    logined: loggedReducer
})
export default allReducers;