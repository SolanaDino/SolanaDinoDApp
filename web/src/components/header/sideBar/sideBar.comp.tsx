import React, { FC } from "react";

import * as hooks from "hooks";
import * as assets from "assets";

import * as styled from "./sideBar.styles";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export interface ISideBarProps {}

export const SideBarComp: FC<ISideBarProps> = () => {
  return (
    <styled.SideBar>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">Love Shack</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/incubator">Incubator</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <a target="_blank" href={"https://dex.solanadino.com"}>
            Dino DEX
          </a>
        </Menu.Item>
        <Menu.Item key="4">
          <a target="_blank" href={"https://solanadino.com"}>
            Website
          </a>
        </Menu.Item>
        <WalletMultiButton />
      </Menu>
    </styled.SideBar>
  );
};
