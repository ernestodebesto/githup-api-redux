import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import AllUsersView from '../AllUsersView/index.jsx';
import DetailView from '../DetailView/index.jsx';
import './styles.css';

class Container extends React.Component {
  static propTypes = {
    users: PropTypes.array,
    hasData: PropTypes.bool
  };

  render() {
    //render AllUsersView by default
    //DetailView if there are certain url params
    let toRender = <AllUsersView users={this.props.users} hasData={this.props.hasData} />
    if (this.props.params && Object.keys(this.props.params).length) {
      toRender = <DetailView params={this.props.params} />
    }

    return  <div className="container">
              <Link to='/' className='container__link'>
                <img src="./img/angular.png" className='container__image'/>
                <h1>AngulaRank</h1>
              </Link>
              {toRender}
            </div>
  }
}

export default Container;