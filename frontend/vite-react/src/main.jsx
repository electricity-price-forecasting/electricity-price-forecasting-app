// import { createRoot } from 'react-dom/client'

// const element = document.querySelector('#root');
// const root = createRoot(element);

// root.render(
//   <h1>New text</h1>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);