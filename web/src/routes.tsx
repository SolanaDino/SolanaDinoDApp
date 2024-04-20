import React, { useMemo } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { WalletProvider } from "@solana/wallet-adapter-react";
import { ConnectionContextProvider } from "./contexts/connection";
import { AccountsProvider } from "./contexts/accounts";
import { AppLayout } from "./components/Layout";

import { HomeView, IncubatorView, LoveshackView } from "./views";
import { IncubatorProvider } from "contexts/incubator";
import { LoveShackProvider } from "contexts/loveshack";
import { HatcherProvider } from "contexts/hatcher";

export function Router() {
  return (
    <HashRouter basename={"/"}>
      <ConnectionContextProvider>
        {/* <WalletProvider wallets={wallets} autoConnect> */}
        <AccountsProvider>
          <LoveShackProvider>
            <IncubatorProvider>
              <HatcherProvider>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<HomeView />} />
                    <Route path="/loveshack" element={<LoveshackView />} />
                    <Route path="/incubator" element={<IncubatorView />} />
                  </Routes>
                </AppLayout>
              </HatcherProvider>
            </IncubatorProvider>
          </LoveShackProvider>
        </AccountsProvider>
        {/* </WalletProvider> */}
      </ConnectionContextProvider>
    </HashRouter>
  );
}
