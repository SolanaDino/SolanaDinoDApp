import React, { useContext, useEffect, useMemo, useState } from "react";
import { clusterApiUrl, PublicKey, AccountInfo } from "@solana/web3.js";
import { ENV as ChainID } from "@solana/spl-token-registry";
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  ExodusWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  BitKeepWalletAdapter,
  Coin98WalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  BraveWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

export type ENV = "mainnet-beta" | "testnet" | "devnet" | "localnet";

export const ENDPOINTS = [
  {
    name: "mainnet-beta" as ENV,
    endpoint: "", // insert RPC
    chainID: ChainID.MainnetBeta,
  },
  {
    name: "testnet" as ENV,
    endpoint: clusterApiUrl("testnet"),
    chainID: ChainID.Testnet,
  },
  {
    name: "devnet" as ENV,
    endpoint: "https://api.devnet.solana.com",
    chainID: ChainID.Devnet,
  },
  {
    name: "localnet" as ENV,
    endpoint: "http://127.0.0.1:8899",
    chainID: ChainID.Devnet,
  },
];

const DEFAULT = ENDPOINTS[0].endpoint;
const DEFAULT_SLIPPAGE = 0.25;

export interface AssociatedTokenAccounts {
  ata: PublicKey;
  ataInfo?: AccountInfo<any>;
}

export function ConnectionContextProvider({ children = undefined as any }) {
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].endpoint);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BitKeepWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new ExodusWalletAdapter(),
      new SolletExtensionWalletAdapter(),
      new SolletWalletAdapter(),
      new LedgerWalletAdapter(),
      new Coin98WalletAdapter(),
      new CoinbaseWalletAdapter(),
      new BraveWalletAdapter(),
    ],
    [endpoint]
  );

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "recent" }}>
      <WalletProvider wallets={wallets}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
