import { createAction } from 'redux-actions';
import format from 'string-format';
import { getNextVideoId } from '../reducers/video';

const api = 'https://searchapi.wyscout.com/api/v1/events/player/{}/{}.json';

const receiveVideoEvents = createAction('RECEIVE_VIDEO_EVENTS', json => (json));

export const setActiveVideo = createAction('SET_ACTIVE_VIDEO', id => (id));
export const setVideoVolume = createAction('SET_VIDEO_VOLUME', value => (value));

export const playNextVideo = () => {
  return (dispatch, getState) => {
    const nextId = getNextVideoId(getState());
    if (nextId) {
      dispatch(setActiveVideo(nextId));
    }
  };
};

export const requestVideoEvents = (playerId, type) => {
  return (dispatch, getState) => {
    const token = getState().settings.userToken;
    dispatch({ type: 'OPEN_VIDEO_PLAYER' });
    dispatch({ type: 'REQUEST_VIDEO_EVENTS' });
    const url = format(api, playerId, type);
    return fetch(`${url}?token=${token}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(response.status);
        }
      })
      .then(json => dispatch(receiveVideoEvents(json)))
      .catch(err => dispatch(showVideoError()))
  };
};

export const showVideoError = createAction('SHOW_VIDEO_ERROR', json => (json));
export const closeVideoPlayer = createAction('CLOSE_VIDEO_PLAYER', json => (json));