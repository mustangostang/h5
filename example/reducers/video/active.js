import Duce from '../duce';

class Active extends Duce {

  defaultState = null;

  receiveVideoEvents = ({ events }) => ( events[0] && this.replace(events[0].id) )
  setActiveVideo = (id) => ( this.replace(id) )
}

export default Active.reducer();