import React, { useState } from "react";
import "./../../App.less";
import { Button, Layout, Menu } from "antd";
import Loader from "react-loader-spinner";

const { Header, Content, Sider } = Layout;

export const LoaderContainer = (props: { loadingShow: boolean }) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className={props.loadingShow ? "dynamic-load" : "static-load"}>
      <div className="loading-mask">
        <Loader
          type="Puff"
          visible={props.loadingShow}
          color="#00BFFF"
          height={100}
          width={100}
          //timeout={300000} //3 secs
        />
      </div>
    </div>
  );
};
