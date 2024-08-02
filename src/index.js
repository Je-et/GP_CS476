/* The core React library for building user interfaces. */
import React from 'react'

/* A package for rendering React components to the DOM. */
import ReactDOM from 'react-dom/client'

/* Contains the main structure and routing of the app. */
import App from './app'

/* Retrieves the HTML element with the ID of 'root' from the DOM. This is where the React application will be rendered. */
/* Creates a root for rendering React content. */
ReactDOM.createRoot(document.getElementById('root')).render(

  /* It helps identify potential problems in the application. */
  <React.StrictMode>

    {/* The main React component that serves as the entry point of the application. */}
    <App />
    
  </React.StrictMode>,
)
