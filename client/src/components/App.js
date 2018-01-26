import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Home from './Home';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="page">
          <header>
            <h1 style={{ padding: '0', margin: '0' }}>ASCII It</h1>
          </header>
          <Switch>
            <Route exact path="/" component={Home} />
            {/* <Route exact path="/home" component={Home} />
              <Redirect from="/main/past" to="/past" /> */}
            {/* <Redirect from="/" to="/home" /> */}
          </Switch>
          <footer>
            <a href="http://interdigitize.com/">interdigitize.com</a>
          </footer>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
