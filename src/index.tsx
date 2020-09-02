import React from 'react';
import ReactDom from 'react-dom';
import { App } from './app';
import './style/index.scss';

ReactDom.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
