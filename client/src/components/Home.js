import React, { Component } from 'react';
import axios from 'axios';
import './Spinner.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      ascii: '',
      submitDisabled: true,
      selectDisabled: false,
      error: false
    };
    this.upload = this.upload.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
    this.reset = this.reset.bind(this);
    this.errors = [];
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
    // console.log('file info', e.target.files[0]);
    this.setState({
      error: false,
      ascii: ''
    });
    this.validate(e.target.files[0]);
  }

  reset() {
    this.setState({
      file: undefined,
      ascii: '',
      submitDisabled: true,
      selectDisabled: false,
      error: false
    });
  }

  validate(file) {
    if (typeof file.type !== 'undefined') {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      ) {
        if (file.size < 5000000) {
          let formData = new FormData();
          formData.append('file', file);
          this.setState({
            file: formData,
            submitDisabled: false
          });
        } else {
          this.setState(
            {
              error: true,
              submitDisabled: true
            },
            () => this.errors.push('size')
          );
        }
      } else {
        // console.log('error in else', this.state.error);
        this.setState(
          {
            error: true,
            submitDisabled: true
          },
          () => this.errors.push('type')
        );
      }
    } else {
      this.reset();
    }
  }

  render() {
    var errors = {
      size: 'Please select a file smaller than 5MB.',
      type: 'Please select a jpg or png.'
    };
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
          {/* {console.log('Error', this.state.error, this.errors)} */}
          {this.state.error ? (
            <div>
              {this.errors.map(error => {
                // console.log(errors, errors[error]);
                return <p>{errors[error]}</p>;
              })}
            </div>
          ) : (
            <span />
          )}
        </form>
        {this.state.selectDisabled === true ? (
          <div class="spinner">
            <div class="cube1" />
            <div class="cube2" />
          </div>
        ) : (
          <span />
        )}
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
