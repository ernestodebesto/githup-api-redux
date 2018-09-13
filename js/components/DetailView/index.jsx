import React from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router';
import axios from 'axios';
import * as constants from '../../Common/Constants.js';
import { parser } from '../../Common/functions.js';
import SingleListItem from '../SingleListItem/index.jsx';
import Spinner from '../Spinner/index.jsx';
import ScrollHandler from '../ScrollHandler/index.jsx';
import './styles.css';

class DetailView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      headerData: null,
      listData: [],
      renderedList: [],
      renderedHeader: null,
      isLoading: true,
      isError: false
    };
  }

  componentDidMount() {
    this.getData()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.userName !== nextProps.params.userName) {
      this.setState({
        isLoading: true,
        headerData: null,
        listData: [],
        renderedList: [],
        renderedHeader: null
      }, () => this.getData())
    }
  }

  getData = (currentPage = 1, data = []) => {
    let url = null;
    if (this.props.params.userName) {
      //  url for getting user's repository list
      url = `${constants.API_URL}users/${this.props.params.userName}/repos?access_token=${constants.TOKEN}&per_page=${constants.PER_PAGE}&page=${currentPage}`
    } else if (this.props.params.repoOwnerName){
      //  url for getting repository's user list
      url = `${constants.API_URL}repos/${this.props.params.repoOwnerName}/${this.props.params.repositoryName}/contributors?access_token=${constants.TOKEN}&per_page=${constants.PER_PAGE}&page=${currentPage}`
    }

    axios(url)
    .then(resp => {
      const fetchedData = [...data, ...resp.data];
      //if there are more pages, get the next one
      let page = null;
      if (resp.headers.link) {
        page = parser(resp.headers.link);
      }
      if (page && page.next) {
        this.getData(Number(page.next), fetchedData)
      } else {
        this.setState({
          listData: fetchedData,
        }, () => this.getHeaderData())
      }
    })
    .catch( error => {
      console.log(error);
      this.setState({ isError: true })
    })
  }

  getHeaderData() {
    let url = null;
    if (this.props.params.userName) {
      //url for getting single user
      url = `${constants.API_URL}users/${this.props.params.userName}`;
    } else if (this.props.params.repositoryName){
      //url for getting single repository
      url = `${constants.API_URL}repos/${this.props.params.repoOwnerName}/${this.props.params.repositoryName}`;
    }
    axios(url)
    .then(resp => this.setState({ headerData: resp.data }, () => this.renderMore() ))
    .catch( error =>{
      console.log(error);
    })
  }

  renderMore = () => {
    const itemsToDisplay = [];
    let toRenderList = null;
    let toRenderHeader = null;

    let amountDisplayed = this.state.renderedList.length + 28;
    if (amountDisplayed > this.state.listData.length) {
      amountDisplayed = this.state.listData.length;
    }
    for (let i = 0; i < amountDisplayed ; i++) {
      itemsToDisplay.push(this.state.listData[i])
    }

    //render component for single repository and list of users
    if (this.state.listData[0] && this.state.listData[0].login) {
      toRenderHeader = <div className='main-block'>
                          <img src={constants.GITHUB_AVATAR} />
                          <h2>{this.state.headerData.name}</h2>
                          <p>Owner: <span>{this.state.headerData.owner.login}</span></p>
                        </div>

      toRenderList = itemsToDisplay.map( item => {
        return  <SingleListItem
                  key={item.id}
                  name={item.login}
                  avatar={item.avatar_url}
                  contributions={item.contributions}
                  extraClass={'item-block--small'} />
    });
    //render component for single user and list of repositories
    } else if (this.state.listData[0] && this.state.listData[0].full_name) {
      toRenderHeader = <div className='main-block'>
                          <img src={this.state.headerData.avatar_url} />
                          <h2>{this.state.headerData.login}</h2>
                          <p>{this.state.headerData.bio}</p>
                          <p>Public Repos: <span>{this.state.headerData.public_repos}</span></p>
                        </div>

      toRenderList = itemsToDisplay.map( item => {
        return  <SingleListItem
                  key={item.id}
                  name={item.name}
                  owner={item.owner.login}
                  extraClass='item-block--small'
                  type='repo' />
      });
    }
    this.setState({
      renderedList: toRenderList || [],
      renderedHeader: toRenderHeader || [],
      isLoading: toRenderList ? false : true
    })
  }

  render() {
    const header = this.state.renderedHeader ? this.state.renderedHeader : null;
    const list = this.state.renderedList ? this.state.renderedList : null;

    return  <div>
              {header}
              <Spinner isVisible={this.state.isLoading} />
              {list}
              <ScrollHandler onLoadMore={this.renderMore} />
            </div>
  }
}

export default DetailView;