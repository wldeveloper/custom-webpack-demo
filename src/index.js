import React from 'react';
import ReactDOM from 'react-dom/client';
import _ from 'lodash';
import App from './App';

import './index.css';

const b = _.clone({});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
