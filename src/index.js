import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import $ from "jquery";

ReactDOM.render(<App />, document.getElementById('root'));

$('#fullpage').fullpage({
  responsiveWidth: 767,
  responsiveHeight: 630
});

registerServiceWorker();
