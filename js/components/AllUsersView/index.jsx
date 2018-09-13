import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Spinner from '../Spinner/index.jsx';
import SortBar from '../SortBar/index.jsx';
import SingleListItem from '../SingleListItem/index.jsx';
import ScrollHandler from '../ScrollHandler/index.jsx';

class AllUsersView extends React.Component {
  static propTypes = {
    users: PropTypes.array,
    hasData: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      users: null,
      visibleUsers: [],
      selectedUser: false
    };
  }

  componentDidUpdate() {
    //when component receives users in props for the first time, save them into state
    if (this.props.users && !this.state.users) {
      this.setState({
        users: this.props.users,
      });
    }
    //when rendering for the first time and after sort
    if (this.state.visibleUsers.length == 0 && this.state.users) {
      this.renderMoreUsers()
    }
  }

  renderMoreUsers = () => {
    const selectedUsers = [];
    let amountToDisplay = this.state.visibleUsers.length + 28;

    if (amountToDisplay > this.state.users.length) {
      amountToDisplay = this.state.users.length;
    }
    for (let i = 0; i < amountToDisplay ; i++) {
      selectedUsers.push(this.state.users[i])
    }

    const users = selectedUsers.map( user => {
      return  <SingleListItem
                key={user.id}
                name={user.login}
                avatar={user.avatar}
                contributions={user.contributions}
                repositories={user.publicRepos}
                followers={user.followers}
                gists={user.gists}
                type='mainViewUser' />

    })
    this.setState({ visibleUsers: users });
  }

  sortUsers = (sortType) => {
    let toSort = [...this.state.users];
    switch (sortType) {
      case 'Contributions':
        toSort.sort( (a,b) => b.contributions - a.contributions);
        break;
      case 'Followers':
        toSort.sort( (a,b) => b.followers - a.followers);
        break;
      case 'Repositories':
        toSort.sort( (a,b) => b.publicRepos - a.publicRepos);
        break;
      case 'Gists':
        toSort.sort( (a,b) => b.gists - a.gists);
        break;
      default:
        break;
  }

    this.setState({
      users: toSort,
      visibleUsers: []
    });
  }

  render() {
    const content = this.props.hasData ? this.state.visibleUsers : null;

    return  <div>
              <SortBar onSort={this.sortUsers} />
                {content}
              <Spinner isVisible={!this.props.hasData}
                       allUsersView={true} />
              <ScrollHandler onLoadMore={this.renderMoreUsers} />
            </div>
  }
}

export default AllUsersView;