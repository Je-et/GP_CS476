/* The core React library for building user interfaces. */
import React from 'react';

/* A package for rendering React components to the DOM. */
import ReactDOM from 'react-dom/client';

/* Contains the main structure and routing of the app. */
import App from './app.jsx';

/* Creates a root for the React application using the selected DOM element. */
/* Renders the React component tree into the created root. */
ReactDOM.createRoot(document.getElementById('root')).render(

  /* Enables additional checks and warnings. */
  <React.StrictMode>

    {/* The main component of the application. */}
    <App />
  </React.StrictMode>,

)