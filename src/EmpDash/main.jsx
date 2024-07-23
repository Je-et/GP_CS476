import React from 'react'
import ReactDOM from 'react-dom/client'
import AppEmp from './AppEmp'
import OrderHistory from './OrderHistory'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  // <Router>
  //   <Route exact path="/" component={App} />
  // </Router>
  <Router>
    <Routes>
      <Route path="/" element={<AppEmp />} />
      <Route path="/OrderHistory" element={<OrderHistory />} />
    </Routes>
  </Router>
)
