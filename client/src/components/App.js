'use strict';
import React, { Component } from 'react';
import { Navbar, NavItem, Footer, Button } from 'react-materialize';
import { BrowserRouter, Route, Link, Switch, Redirect } from 'react-router-dom';
import Home from './Home';

import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className='page'>
          <Navbar className="nav-bar" brand="ASCII It" right options={{closeOnClick: true}}>
            {/* <img class="responsive-img" id="logo" src=""/> */}
            {/* <NavItem>
              <Link to="/home">Home</Link>
            </NavItem>
            <NavItem>
              <Link to="/why">Why Service</Link>
            </NavItem> */}
          </Navbar>

            <Switch>
              <Route exact path="/" component={Home} />
                {/* <Route exact path="/home" component={Home} />
              <Redirect from="/main/past" to="/past" /> */}
              {/* <Redirect from="/" to="/home" /> */}
            </Switch>
            <Footer copyrights=""
            	// moreLinks={
            	// 	<a className="grey-text text-lighten-4 right" href=""></a>
            	// }
            	// links={
            	// 	// <ul>
            	// 	// 	<li><a className="grey-text text-lighten-3" href="">Facebook</a></li>
            	// 	// 	<li><a className="grey-text text-lighten-3" href="">YouTube</a></li>
            	// 	// 	<li><a className="grey-text text-lighten-3" href="">Twitter</a></li>
            	// 	// 	<li><a className="grey-text text-lighten-3" href="">Instagram</a></li>
            	// 	// </ul>
            	// }
            	// className='example'
            >
            		<h5 className="white-text"></h5>
            		<p className="grey-text text-lighten-4"></p>
            </Footer>
          </div>
      </BrowserRouter>
    );
  }
}

export default App;
