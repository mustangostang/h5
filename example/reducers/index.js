import { combineReducers } from 'redux';
import video from './video';
import settings from './setting';

const mainReducer = combineReducers({
    video,
    settings
});

export default mainReducer;
