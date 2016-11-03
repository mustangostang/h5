import Duce from '../duce';

class Events extends Duce {

  defaultState = [];

  requestVideoEvents = () => ( this.replace([]) )
  receiveVideoEvents = ({ events }) => ( this.replace(events) )
}

export default Events.reducer();