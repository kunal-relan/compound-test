import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = React.createRef();
const apiUrl = 'https://us-central1-my-project-1477802989223.cloudfunctions.net';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      error: '',
      message: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    recaptchaRef.current.execute();
    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
    };

    axios
      .post(`${apiUrl}/compound`, newUser)
      .then(res => this.setState({message:res.data.message}))
      .catch(err => this.setState({ error: err.response.data.error }));
  }

  render() {
    const { error, message } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your Compound account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg')}
                    placeholder="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg')}
                    placeholder="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': error,
                      'is-valid': message
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {error && (
                    <div className="invalid-feedback">{error}</div>
                  )}
                  {message && (
                    <div className="valid-feedback">{message}</div>
                  )}
                </div>
                <ReCAPTCHA sitekey="6LfNI38UAAAAAHe3ILxncbsE5kcEgLDSkmR1Zc_k" ref={recaptchaRef} size="invisible" />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
