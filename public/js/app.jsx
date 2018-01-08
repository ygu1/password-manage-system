import 'babel-polyfill';
import ReactDOM from 'react-dom';
import React from 'react';

const HomePage = require('./components/HomePage.jsx');

$(document).ready(() => {
  ReactDOM.render(
    <HomePage />, document.getElementById('react-content'),
  );
});
