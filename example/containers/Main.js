import { connect } from 'react-redux';
import { requestVideoEvents } from '../actions';
import Main from '../components/Main';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onPlayVideo: (playerId, type) => { dispatch(requestVideoEvents(playerId, type)); }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
