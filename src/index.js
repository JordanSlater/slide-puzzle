import React, { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import ReactDOM from 'react-dom';
import "./styles.css";

import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <title>Slide Puzzle</title>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
