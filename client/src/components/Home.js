import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      ascii: ''
    };
    this.upload = this.upload.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  upload(e) {
    e.preventDefault();
    var url = '/photo';
    let data = this.state.file;
    var config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    axios({ method: 'post', url, data, config })
      .then(res => {
        this.setState({ ascii: res.data }, () => {
          document.getElementById('upload').reset();
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onChange(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('file', e.target.files[0]);
    this.setState({
      file: formData
    });
  }

  render() {
    return (
      <div className="content">
        <Row>
          <Col s={12}>
            <form id="upload">
              <input type="file" onChange={this.onChange} />
              <button type="submit" onClick={this.upload}>
                Submit
              </button>
            </form>
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            {this.state.ascii !== '' ? (
              <img
                alt="ASCII version"
                src={this.state.ascii}
                style={{ width: '100%', height: 'auto' }}
              />
            ) : (
              <span />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Home;
