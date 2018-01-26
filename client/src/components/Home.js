import React, { Component } from 'react';
import axios from 'axios';
import './Spinner.css';
import './App.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: undefined,
      ascii: '',
      submitDisabled: true,
      selectDisabled: false,
      typeError: false,
      sizeError: false
    };
    this.upload = this.upload.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validate = this.validate.bind(this);
    this.reset = this.reset.bind(this);
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
    this.setState({
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
      typeError: false,
      sizeError: false
    });
  }

  validate(file) {
    if (file) {
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      ) {
        if (file.size < 5000000) {
          let formData = new FormData();
          formData.append('file', file);
          this.setState({
            file: formData,
            submitDisabled: false,
            typeError: false,
            sizeError: false
          });
        } else {
          this.setState({
            sizeError: true,
            submitDisabled: true
          });
        }
      } else {
        // console.log('error in else', this.state.error);
        this.setState({
          typeError: true,
          submitDisabled: true
        });
      }
    } else {
      this.reset();
    }
  }

  render() {
    return (
      <main>
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
          {this.state.typeError ? (
            <div className="error">Please select a jpg or png.</div>
          ) : (
            <span />
          )}
          {this.state.sizeError ? (
            <div className="error">Please select a file smaller than 5MB.</div>
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
      </main>
    );
  }
}

export default Home;
