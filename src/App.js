import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { loadReCaptcha } from 'react-recaptcha-google';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';

import './App.css';

class App extends Component {

  //Load Recaptcha
  componentDidMount() {
    loadReCaptcha();
  }
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route path="/" component={Register} />
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
