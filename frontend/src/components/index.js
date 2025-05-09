import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Import global styles

// Create a root for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);