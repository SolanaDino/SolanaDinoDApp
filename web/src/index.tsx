import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";

import { AppComp } from "./App";
import { store } from "state/store";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import "antd/dist/antd.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppComp />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
