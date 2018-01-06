'use strict';
import React, { Component } from 'react';
import { Row, Col} from 'react-materialize';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      ascii: ''
    }
    this.upload = this.upload.bind(this);
    this.onChange = this.onChange.bind(this);

  }

  upload() {
    var url = '/photo';
    let data = this.state.file
    console.log(data);
    var config = {
      headers: { 'content-type': 'multipart/form-data' }
    }
    axios({method: 'post', url, data, config})
     .then((res) => {
       this.setState({ascii: res.data})
       console.log(res.data)
     })
     .catch((err) => {
       console.log(err)
     })
  }

  onChange(e) {
    let formData = new FormData(); //FormData needs to be used for Multer to parse the data on the server
    formData.append('file', e.target.files[0]);
    this.setState({
      file: formData
    });
    console.log('file', this.state.file);
    console.log('formData', formData)
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col s={12}>
            <input type="file" onChange={ this.onChange } />
            <button type="submit" onClick={ this.upload }>Submit</button>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            {this.state.ascii}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
