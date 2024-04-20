import React, { FC } from "react";
import { Global } from "@emotion/react";
import { globalStyle } from "./App.styles";
import { Router } from "./routes";

import "./App.less";
import "./App.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export interface IAppComp {}

export const AppComp: FC<IAppComp> = () => {
  return (
    <>
      <Global styles={globalStyle} />
      <Router />
    </>
  );
};
