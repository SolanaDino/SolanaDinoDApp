import React, { FC } from "react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "state";
import { toggleRightSidebar } from "state/ui/actions";

import * as assets from "assets";
import * as hooks from "hooks";

import { SideBarComp } from "../sideBar";

import * as styled from "./headerBar.styles";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

export interface IHeaderBarComp {}

export const HeaderBarComp: FC<IHeaderBarComp> = () => {
  const { isMobile } = hooks.useIsMobile();
  const dispatch = useAppDispatch();
  const { balanceEgg } = hooks.useEggBalance();
  const { connected } = useWallet();
  const rightSidebar = useAppSelector((state) => state.ui.rightSidebar);

  return (
    <styled.Header>
      <Link to="/">
        <div className="app-title">
          <div>
            <img
              src={assets.DINO_ICON}
              className="dino-logo-header"
              alt="Dino_logo"
            />
          </div>
          <h2>DINO</h2>
        </div>
      </Link>
      {!isMobile && (
        <styled.HeaderActions>
          <div className="nav-label">
            <Link to="/">Love Shack</Link>
          </div>
          <div className="nav-label">
            <Link to="/incubator">Incubator</Link>
          </div>
          <div className="nav-label">
            <a target="_blank" href={"https://dex.solanadino.com"}>
              Dino DEX
            </a>
          </div>
          <div className="nav-label">
            <a target="_blank" href={"https://solanadino.com"}>
              Website
            </a>
          </div>
        </styled.HeaderActions>
      )}

      <styled.WalletSection>
        <div className="egg-view">
          <img src={assets.DINO_EGG_ICON} className="egg-logo" alt="Egg_logo" />{" "}
          {balanceEgg.toFixed(2)}
        </div>

        {isMobile ? (
          <styled.BurgerSection>
            <styled.MobileToggler
              onClick={() => dispatch(toggleRightSidebar())}
            >
              {rightSidebar ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </styled.MobileToggler>
            {rightSidebar && <SideBarComp />}
          </styled.BurgerSection>
        ) : (
          <WalletMultiButton />
        )}
      </styled.WalletSection>
    </styled.Header>
  );
};
