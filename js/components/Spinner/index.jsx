import React from 'react';
import PropTypes from 'prop-types';
import './styles.css'

class Spinner extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    allUsersView: PropTypes.bool
  };

  render() {
    let spinner = null;
    let spinnerMessage = null;

    if (this.props.allUsersView) {
      spinnerMessage = <p>First fetching of thousands of Angular contributors may take a few minutes</p>
    }
    if (this.props.isVisible) {
      spinner = <div className='spinner'>
                  <img src="./img/spinner.svg" />
                  {spinnerMessage}
                </div>
    }

    return spinner
  }
}

export default Spinner;