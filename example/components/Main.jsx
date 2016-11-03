import React from 'react';

export default class Main extends React.Component {

  static propTypes = {
    onPlayVideo: React.PropTypes.func.isRequired,
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={ () => this.props.onPlayVideo(132447, 'goals') }>Play Video</button>
    );
  }
}

