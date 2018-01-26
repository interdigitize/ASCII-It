import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      ascii: '',
      submitDisabled: true,
      selectDisabled: false
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
    this.setState({
      selectDisabled: true,
      submitDisabled: true
    });
    axios({ method: 'post', url, data, config })
      .then(res => {
        this.setState(
          {
            ascii: res.data,
            selectDisabled: false,
            submitDisabled: true
          },
          () => {
            document.getElementById('upload').reset();
          }
        );
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
      file: formData,
      submitDisabled: false
    });
  }

  render() {
    return (
      <div className="content">
        <h2>Upload an image to convert it.</h2>

        <form id="upload">
          <input
            type="file"
            onChange={this.onChange}
            disabled={this.state.selectDisabled}
          />
          <button
            type="submit"
            onClick={this.upload}
            disabled={this.state.submitDisabled}>
            ASCII It
          </button>
        </form>
        {this.state.ascii !== '' ? (
          <div>
            <img
              alt="ASCII version"
              src={this.state.ascii}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ) : (
          <span />
        )}
      </div>
    );
  }
}

export default Home;
