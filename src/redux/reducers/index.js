import { combineReducers } from 'redux';
import AuthReducers from './AuthReducer';
// state global
export default combineReducers({
    Auth: AuthReducers,
});
