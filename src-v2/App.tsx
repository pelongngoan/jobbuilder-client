import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import AppRoutes from "./routes";
import "./index.css";
// Global styles would be imported here
// import './styles/global.css';

export const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
