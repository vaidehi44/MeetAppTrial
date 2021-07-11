import React, { Component } from 'react';
import Room from './Room';
import SimpleRoom from './SimpleRoom';
import StreamPermissions from './StreamPermissions'
import Register from './Register';
import Login from './Login';
import Session from './Session';
import Homepage from './Homepage';
import SimpleHomepage from './SimpleHomepage';
import { v4 as uuidv4 } from 'uuid';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';

class App extends Component {

  constructor(props) {
		super(props);
		this.state = {
      userToken: null,
		}
    this.isLoggedIn = false;
  };


  componentDidMount() {
    const token = localStorage.getItem('meetapp-bearer-token');
    this.setState({ userToken: token });

  }
  render() {
    const { userToken } = this.state;

    if (userToken) this.isLoggedIn=true;

    let routes = <Switch></Switch>

    if (this.isLoggedIn) {
      routes = (
        <Switch>
          <Route path='/sessions' component={Session} />

          <Route path='/:id/:session/:name/:video/:audio' render = {(props) =>
              <Room {...props}/> }>
          </Route>

          <Route path='/:id/:session' render = {(props) =>
              <StreamPermissions {...props}/> }>
          </Route>

          <Route path='/' component={Homepage} />

          <Redirect to="/" />
        </Switch>
      )
    }

    if (!this.isLoggedIn) {
      routes = (
        <Switch>

          <Route exact path='/:id/:session' render = {(props) =>
            <StreamPermissions {...props}/> }>
          </Route>

          <Route path='/:id/:session/:name/:video/:audio' render = {(props) =>
              <SimpleRoom {...props}/> }>
          </Route>

          <Route path='/register' component={Register} />
          
          <Route path='/login' component={Login} />

          <Route path='/' component={SimpleHomepage} />
          
          <Redirect to="/" />
        </Switch>
      )
    }
    return(
      <BrowserRouter> {routes} </BrowserRouter>
      
    );
  };
};

export default App;