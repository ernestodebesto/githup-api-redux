import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import InitialFetcher from './components/InitialFetcher/index.jsx';
import NotFound from './components/NotFound/index.jsx';
import Container from './components/Container/index.jsx';

document.addEventListener('DOMContentLoaded', function() {
  class App extends React.Component {
    render() {
      return  <Router history={hashHistory}>
                <Route path='/' component={InitialFetcher} />
                <Route path='/user/:userName' component={Container} />
                <Route path='/repository/:repoOwnerName/:repositoryName' component={Container} />
                <Route path='*' component={NotFound} />
              </Router>
    }
  }

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
});