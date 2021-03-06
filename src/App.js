import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layouts/Navbar';
import Users from './components/users/Users'
import User from './components/users/User'
import axios from 'axios';
import Search from './components/users/Search'
import Alert from './components/layouts/Alert'
import About from './components/pages/About'
import './App.css';

class App extends Component {
  state ={
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  }

  // async componentDidMount() {
  //   this.setState({ loading: true });

  //   const res = await axios.get(`url`)

  //   // when this is happening, the whole app is rerendered!
  //   this.setState({ users: res.data, loading: false })
  //   // console.log(res.data);
  // }

  // passing a function up??wow
  searchUsers = async text => {
    this.setState({ loading: true });
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)

    //why did we set it to items?
    this.setState({ users: res.data.items, loading: false })
    // console.log(res.data);
  }

// get a single user
getUser = async (username) => {
  this.setState({ loading: true });

  const res = await axios.get(
    `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
  );
  this.setState({ user: res.data, loading: false });
};

//  Get user reppos
getUserRepos = async username => {
  this.setState({ loading: true });

  const res = await axios.get(
    `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
  );
  this.setState({ repos: res.data, loading: false });
};

  // Clear users from state
  clearUsers = () => this.setState({ users: [], loading: false })

  setAlert = (msg,type) => {
    this.setState({ alert: { msg, type } })

    setTimeout(() => this.setState({ alert:null }), 3000)
  }

  render() {
  const { users, loading, user, repos } = this.state

      return (
        < Router>
          <div className="App">
            <Navbar title="Github Finder" icon="fa fa-github" />
            <div className="container">
              <Alert alert={this.state.alert} />
              <Switch>
                <Route exact path='/' render={ props => (
                  <Fragment>
                    <Search 
                      searchUsers={this.searchUsers} 
                      clearUsers={this.clearUsers}
                      // ternary comfy operators
                      showClear={users.length > 0 ? true:false }
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}></Route>
                <Route exact path="/about" component={About}/>
                <Route
                exact
                path='/user/:login'
                render={(props) => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    repos={repos}
                    loading={loading}
                    user={user}
                  />
                )}
              />
              </Switch>
            </div>
          </div>
        </Router>
    );
  }
}

export default App