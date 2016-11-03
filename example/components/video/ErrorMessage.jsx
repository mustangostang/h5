import styles from './Playlist.scss';
import clickOutsideWrapper from 'react-click-outside';

class ErrorMessage extends React.Component {

  constructor() {
    super();
    this.onEscape = this.onEscape.bind(this);
  }

  static propTypes = {
    open: React.PropTypes.bool.isRequired,
    onCloseVideo: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onEscape);
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

  render() {
    return (
      <div className={ styles.errorBody }>
        <div className={ styles.close } onClick={ this.props.onCloseVideo }></div>
        <div className={ styles.videoIcon }></div>
        <div>Sorry, no video found</div>
      </div>
    );
  }

}

export default clickOutsideWrapper(CSSModules(ErrorMessage), styles);
