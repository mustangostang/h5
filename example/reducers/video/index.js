import { createSelector } from 'reselect';
import { combineReducers } from 'redux';
import open from './open';
import error from './error';
import active from './active';
import events from './events';
import information from './information';

const Video = combineReducers({
  open,
  error,
  active,
  events,
  information
});

export default Video;

export const isVideoOpen = state => state.video.open;
export const isVideoErrored = state => state.video.error;
export const getLoader = state => state.video.information.loadingVideos;
export const getTitle = state => state.video.information.title;
export const getVolume = state => state.video.information.volume;
const getActiveVideoId = state => state.video.active;
const getRawVideoEvents = state => state.video.events;

export const getVideoEvents = createSelector(
  getRawVideoEvents, getActiveVideoId,
  (videoEvents, videoId) => {
    return videoEvents.map(video => (
      {
        ...video,
        active: video.id === videoId
      }
    ));
  }
);

export const getNextVideoId = state => {
  const eventsWithActive = getVideoEvents(state);
  const index = _.findIndex(eventsWithActive, 'active');
  if (index === -1 || index === eventsWithActive.length) return undefined;
  return eventsWithActive[index + 1] && eventsWithActive[index + 1].id;
};

export const getIndexedVideoEvents = createSelector(getVideoEvents, (videoEvents) => _.keyBy(videoEvents, 'id'));
export const getActiveVideo = createSelector(getIndexedVideoEvents, getActiveVideoId,
  (videoEvents, id) => videoEvents[id]
);
