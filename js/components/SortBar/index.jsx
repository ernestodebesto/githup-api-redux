import React from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class SortBar extends React.Component {
  static propTypes = {
    onSort: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentSort: '',
      menuVisible: false
    };
  }

  toggleSortingMenu() {
    this.setState({
      menuVisible: !this.state.menuVisible
    })
  }

  sortBy(key) {
    this.setState({
      currentSort: key,
      menuVisible: false
    })
    this.props.onSort(key)
  }

  render() {
    return  <div onClick={() => this.toggleSortingMenu()} className="sort-bar">
              <p>Sort by:</p>
              <p className={'sort-bar--selected'}>{this.state.currentSort}</p>
              <div className={this.state.menuVisible ? "sort-bar__menu--visible" : "sort-bar__menu--hidden"}>
                <p onClick={() => this.sortBy('Contributions')}>Contributions</p>
                <p onClick={() => this.sortBy('Gists')}>Gists</p>
                <p onClick={() => this.sortBy('Followers')}>Followers</p>
                <p onClick={() => this.sortBy('Repositories')}>Repositories</p>
              </div>
            </div>
  }
}

export default SortBar;