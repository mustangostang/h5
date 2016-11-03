import Duce from '../duce';

class Open extends Duce {

  defaultState = false;

  openVideoPlayer = () => ( this.replace(true) )
  closeVideoPlayer = () => ( this.replace(false) )
}

export default Open.reducer();
