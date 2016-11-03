import React from 'react';

import CSSModules from 'react-css-modules';
import styles from './Loader.scss';

class Loader extends React.Component {

  static propTypes = {
    isWhite: React.PropTypes.bool
  }

  render() {
    return <div className={ this.props.isWhite ? styles.white : styles.loader}></div>;
  }
}

export default CSSModules(Loader, styles);
