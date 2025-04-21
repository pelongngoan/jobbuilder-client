import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { apiRequest } from "./lib/api/axios";
import { loadingInterceptors } from "./lib/api/axios-interceptors";
import App from "./App";
import "./index.css";

// Apply loading interceptors
loadingInterceptors(apiRequest);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
