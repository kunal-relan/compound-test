import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { ReCaptcha } from 'react-recaptcha-google';
const apiUrl = 'https://us-central1-my-project-1477802989223.cloudfunctions.net';

class Register extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      error: '',
      message: '',
      captchaToken: ''
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    if (this.captchaDemo) {
        this.captchaDemo.reset();
        this.captchaDemo.execute();
    }
  }

  onLoadRecaptcha() {
    if (this.captchaDemo) {
        this.captchaDemo.reset();
        this.captchaDemo.execute();
    }
  }
  verifyCallback(recaptchaToken) {
    if(recaptchaToken){
      this.setState({ captchaToken: recaptchaToken });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      captchaToken: this.state.captchaToken
    };

    axios
      .post(`${apiUrl}/compound`, newUser)
      .then(res => this.setState({message:res.data.message, error:''}))
      .catch(err => this.setState({ error: err.response.data.error, message:'' }));
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
                <ReCaptcha ref={(el) => {this.captchaDemo = el;}} size="invisible" render="explicit" sitekey="6LfNI38UAAAAAHe3ILxncbsE5kcEgLDSkmR1Zc_k" onloadCallback={this.onLoadRecaptcha} verifyCallback={this.verifyCallback} />
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
