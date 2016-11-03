import { connect } from 'react-redux';
import Video from '../components/video';
import { isVideoOpen, isVideoErrored, getVideoEvents, getActiveVideo, getLoader, getTitle, getVolume } from '../reducers/video';
import { closeVideoPlayer, setActiveVideo, playNextVideo, setVideoVolume } from '../actions';

const mapStateToProps = (state) => {
  return {
    open: isVideoOpen(state),
    errored: isVideoErrored(state),
    playlist: getVideoEvents(state),
    video: getActiveVideo(state),
    isLoading: getLoader(state),
    title: getTitle(state),
    volume: getVolume(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseVideo: () => { dispatch(closeVideoPlayer()); },
    onChangeVideo: (id) => { dispatch(setActiveVideo(id)); },
    onNextVideo: () => { dispatch(playNextVideo()); },
    setVideoVolume: (val) => {dispatch(setVideoVolume(val))}
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Video);
