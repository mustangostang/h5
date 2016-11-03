export default class Event extends React.Component {

  static propTypes = {
    id: React.PropTypes.number.isRequired,
    minute: React.PropTypes.number.isRequired,
    matchName: React.PropTypes.string.isRequired,
    matchDate: React.PropTypes.string.isRequired,
    active: React.PropTypes.bool.isRequired,
    onChangeVideo: React.PropTypes.func.isRequired,
    number: React.PropTypes.number.isRequired
  }

  onClick = () => {
    this.props.onChangeVideo(this.props.id);
  }

  render = () => {
    const { id, matchName, active, number } = this.props;
    let className = 'event';
    if (active) className = 'event playing';
    return (<div className={ className } key={ id } onClick={ this.onClick }>
        <div className="event-number">{ number }</div>
        <div className="event-name">{ matchName }</div>
    </div>);
  }
}
