import React from 'react';
import axios from 'axios';
import * as constants from '../../Common/Constants.js';
import { parser, mergeArrays } from '../../Common/functions.js';
import Container from '../Container/index.jsx';


class InitialFetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      hasData: false
    };
  }

  componentDidMount() {
    const users = localStorage.getItem('users');
    if (users) {
      this.setState({
        users: JSON.parse(users),
        hasData: true
      })
    } else {
      this.fetchAllData();
    }
  }

  fetchAllData = (currentPage = 1, data = []) => {
    const url = `${constants.API_URL}orgs/${constants.ORG}/repos?access_token=${constants.TOKEN}&per_page=${constants.PER_PAGE}&page=${currentPage}`
    axios(url)
    .then(resp => {
      const fetchedData = [...data, ...resp.data];
      //when there are more pages, get the next one
      let page = null
      if (resp.headers.link) {
        page = parser(resp.headers.link);
      }
      if (page && page.next) {
        this.fetchAllData(Number(page.next), fetchedData)
      } else {
        this.getContributorsList(fetchedData);
      }
    })
    .catch( error =>{
      console.log(error);
    })
  }

  getContributorsList = (data) => {
    const allUrls = [];
    let userList = [];
    const multiplePageUsers = [];

    for (let el of data){
      allUrls.push(el.contributors_url);
    }

    const promiseArray = allUrls.map( url => {
      const fetchUrl = `${url}?page=1&per_page=${constants.PER_PAGE}&access_token=${constants.TOKEN}`;
      return axios(fetchUrl)
    })

    axios.all(promiseArray)
    .then( resp => {
      for (let el of resp) {
        const userData = el.data;
        //add users with multiple pages to array
        if (el.headers.link) {
          let pagesHeader = parser(el.headers.link);
          const multiplePageUser = {
            url: el.config.url,
            lastPage: pagesHeader.last
          };
          multiplePageUsers.push(multiplePageUser)
        } else if (userData) {
            userList = mergeArrays(userData, userList)
        }
      }
      const finalUrls = this.getMultiplePagesUrls(multiplePageUsers)
      this.getAllContributors(finalUrls, userList)
    })
    .catch( error => {
        console.log(error);
    })
  }
  //get also contributors with multiple pages
  getAllContributors(urls, data) {
    let userList = data;
    const promiseArray = urls.map(url => {
      return axios.get(url)
    });

    axios.all(promiseArray)
    .then( resp => {
      for (let userGroup of resp) {
        const group = userGroup.data;
        userList = mergeArrays(group, userList)
      }
      this.finalFetchAndSave(userList)
    })
    .catch( error =>{
      console.log(error);
    })
  }

  finalFetchAndSave(completeList) {
    const promiseArray = completeList.map(user => {
      const userUrl = `${user.url}?access_token=${constants.TOKEN}`;
      return axios(userUrl)
    })

    axios.all(promiseArray)
    .then(resp => {
      const finalData = [];
      for (let [i, object] of resp.entries()) {
        const user = {
          login: object.data.login,
          publicRepos: object.data.public_repos,
          gists: object.data.public_gists,
          id: object.data.id,
          avatar: object.data.avatar_url,
          followers: object.data.followers,
          contributions: completeList[i].contributions
        }
        if (user) {
          finalData.push(user)
        }
      }
      localStorage.setItem('users',JSON.stringify(finalData));
      this.setState({
        users: finalData,
        hasData: true
      })
    })
    .catch( error =>{
      console.log(error);
    })
  }

  //helper methods
  getMultiplePagesUrls(userArr) {
    let urlsToDownload = [];
    for (let i = 0 ; i < userArr.length; i++){
      const singleUrl = this.createUserUrl(userArr[i].url, userArr[i].lastPage);
      urlsToDownload = [...urlsToDownload, ...singleUrl]
    }
    return urlsToDownload
  }

  createUserUrl(url, maxPages){
    const urlsArr = [];
    for (let i = 2; i <= maxPages; i++ ){
      const userUrl = `${url}&page=${i}`;
      urlsArr.push(userUrl);
    }
    return urlsArr;
  }

  render() {
    return  <Container
              users={this.state.users}
              hasData={this.state.hasData} />
  }
}

export default InitialFetcher;