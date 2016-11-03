const defaultState = {
  loadingVideos: false,
  title: '',
  volume: 1
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'REQUEST_VIDEO_EVENTS':
      return { ...state, loadingVideos: true, title: '' };
    case 'RECEIVE_VIDEO_EVENTS':
      return { ...state, loadingVideos: false, title: action.payload.title };
    case 'SET_VIDEO_VOLUME':
      return {...state, volume: action.payload}

    default:
      return state;
  }
};

export default reducer;
