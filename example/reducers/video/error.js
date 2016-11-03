import Duce from '../duce';

class Error extends Duce {

  defaultState = false;

  showVideoError = () => ( this.replace(true) )
  closeVideoPlayer = () => ( this.replace(false) )
}

export default Error.reducer();
