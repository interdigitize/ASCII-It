'use strict';
import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Row, Col} from 'react-materialize';

class Home extends Component {
  render() {
    return (
      <CSSTransitionGroup
        transitionName="sample-app"
        transitionEnterTimeout={500}
        transitionAppearTimeout={500}
        transitionLeaveTimeout={300}
        transitionAppear={true}
        transitionEnter={true}
        transitionLeave={true}
      >
        <div className="content">
          <Row>
            <Col s={12} l={6}>
              The beginning...
            </Col>
            <Col s={12} l={6}>
            </Col>
          </Row>
        </div>
      </CSSTransitionGroup>
    );
  }
}

export default Home;
