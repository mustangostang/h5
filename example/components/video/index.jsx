import Loader from '../Loader';
import ErrorMessage from './ErrorMessage';
import Playlist from './Playlist';

export default class Video extends React.Component {

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    errored: React.PropTypes.bool.isRequired,
    isLoading: React.PropTypes.bool.isRequired,
    title: React.PropTypes.string.isRequired,
    volume: React.PropTypes.number.isRequired,
    video: React.PropTypes.object.isRequired,

    onCloseVideo: React.PropTypes.func.isRequired,
    onNextVideo: React.PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errored !== this.props.errored) {
      this.setState({error: nextProps.errored});
      this.forceUpdate();
    }
  }

  state = {
    error: false
  }

  renderVideoPlayer = () => {
    if (this.props.errored) return <ErrorMessage {...this.props} />;
    if (this.props.isLoading) return <Loader isWhite={ true } />;
    return <Playlist {...this.props} />;
  }

  render() {
    if (!this.props.open) return null;
    return (
        <div className="video-player-wrapper" key="video-player-wrapper">
          { this.renderVideoPlayer() }
        </div>
    );
  }

}
