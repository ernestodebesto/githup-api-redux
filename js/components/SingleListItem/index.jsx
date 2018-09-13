import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import * as constants from '../../Common/Constants.js';
import './styles.css';

class SingleListItem extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    contributions: PropTypes.number,
    repositories: PropTypes.number,
    followers: PropTypes.number,
    gists: PropTypes.number,
    owner: PropTypes.string,
    bio: PropTypes.string,
    extraClass: PropTypes.string,
    type: PropTypes.string
  };

  render() {
    let route = null;
    let extraInfo = null;
    let contributionsInfo = null
    let image = this.props.avatar ? this.props.avatar : constants.GITHUB_AVATAR;

    if (this.props.type === 'repo') {
      route = `/repository/${this.props.owner}/${this.props.name}`;
      extraInfo= <div>
                  <p>Owner: <span>{this.props.owner}</span></p>
                 </div>
    } else {
      route = `/user/${this.props.name}`;
    }

    if (this.props.type === "mainViewUser") {
      extraInfo = <div>
                    <p>Repositories: <span>{this.props.repositories}</span></p>
                    <p>Followers: <span>{this.props.followers}</span></p>
                    <p>Gists: <span>{this.props.gists}</span></p>
                  </div>
    }

    if (this.props.contributions) {
      contributionsInfo = <p>Contributions: <span>{this.props.contributions}</span></p>
    }

    return  <div className={`item-block ${this.props.extraClass}`}>
              <Link to={route}>
                <img src={image} />
                <h2>{this.props.name}</h2>
                {extraInfo}
                {contributionsInfo}
              </Link>
            </div>
  }
}

export default SingleListItem;