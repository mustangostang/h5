import VideoPlayer from '../../../src/Video';
import Event from './Event';
import styles from './Playlist.scss';
import clickOutsideWrapper from 'react-click-outside';

class Playlist extends React.Component {

  constructor() {
    super();
    this.onEscape = this.onEscape.bind(this);
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    playlist: React.PropTypes.array.isRequired,
    video: React.PropTypes.object.isRequired,
    volume: React.PropTypes.number.isRequired,

    onCloseVideo: React.PropTypes.func.isRequired,
    onChangeVideo: React.PropTypes.func.isRequired,
    onNextVideo: React.PropTypes.func.isRequired,
    setVideoVolume: React.PropTypes.func.isRequired,
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEscape);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.video, this.props.video)) {
      this.forceUpdate();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.video !== prevProps.video) {
      const playingIndex = _.findIndex(this.props.playlist, this.props.video);
      const scrollTo = (playingIndex * 56) - 220;
      this._scrollWrapper.scrollTop = scrollTo;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape);
  }

  onEscape({ keyCode }) {
    if (keyCode === 27) {
      this.props.onCloseVideo();
    }
  }

  handleClickOutside(event) {
    if (this.props.open) {
      this.props.onCloseVideo();
      event.stopPropagation();
    }
  }

  _scrollWrapper

  getScrollWrapper = (elem) => {
    this._scrollWrapper  = elem;
  }

  renderTitle = () => {
    if (!this.props.video) return null;
    const { playerName, minute, matchName, matchDate } = this.props.video;
    return (
      <div className={ styles.header }>
        <h1 className={ styles.mainTitle }>{ playerName }, { minute }&#39;</h1>
        <p className={ styles.mainInfo }>
          { matchName } | { matchDate }
        </p>
      </div>
    );
  }

  setVolume(volume) {
    if (this.props.volume !== +volume)
      this.props.setVideoVolume(+volume)
  }

  onChangeCropValue = (start, end) => {
    console.log(start, end)
  }

  renderVideo = () => {
    if (!this.props.video) return null; // Loader here?
    const { id, url } = this.props.video;
    return (<VideoPlayer key={ id }
      volume={this.props.volume}
      autoPlay sources={ [url] }
      controlPanelStyle="fixed"
      cropVideoLength={true}
      getCropValue={this.onChangeCropValue}
      width="896" height="504"
      onVolumeChange={(v) => this.setVolume(v)}
      onEnded={ this.props.onNextVideo } />);
  }

  renderEvent = (event) => (
    <Event key={ event.id } {...event} number={ _.findIndex(this.props.playlist, event) + 1 } onChangeVideo={ this.props.onChangeVideo } />
  )

  render() {
    return (
      <div className={ styles.body }>
        <div className={ styles.close } onClick={ this.props.onCloseVideo }></div>
        <div className={ styles.video }>
          { this.renderTitle() }
          { this.renderVideo() }
        </div>
        <div className={ styles.playlist }>
          <h2 className={ styles.playlistTitle }>{ this.props.title } ({ (this.props.playlist).length })</h2>
          <div className={ styles.playlistBody } ref={this.getScrollWrapper}>
            { this.props.playlist.map(event => this.renderEvent(event)) }
          </div>
        </div>
      </div>
    );
  }

}

export default clickOutsideWrapper(CSSModules(Playlist), styles, {allowMultiple: true});
