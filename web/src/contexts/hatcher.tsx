import React, { useContext, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";

import * as HatchIDL from "./hatch";
import * as models from "models";

import * as mints from "consts/mints";
import { Wallet } from "@project-serum/anchor/dist/cjs/provider";

const HatcherContext = React.createContext<any>(null);

export const useHatcherContext = () => {
  const context = useContext(HatcherContext);

  return context;
};

export function HatcherProvider({ children = null as any }) {
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();
  const [hatcherRealProgram, setHatcherRealProgram] =
    useState<anchor.Program<models.Hatch>>();

  const [hatcherFakeProgram, setHatcherFakeProgram] =
    useState<anchor.Program<models.Hatch>>();

  useEffect(() => {
    if (connection && connected && publicKey && signTransaction) {
      // const keypair = new web3.Keypair();
      // const fakeWallet = new NodeWallet(keypair);

      const hackyWallet: Wallet = {
        publicKey: publicKey,
        signTransaction: signTransaction,
      } as any;

      const fakeWallet: Wallet = {
        signTransaction: Promise.resolve.bind(Promise),
        signAllTransactions: Promise.resolve.bind(Promise),
        publicKey: publicKey,
      };

      const provider = new anchor.AnchorProvider(connection, fakeWallet, {});

      const provider2 = new anchor.AnchorProvider(connection, hackyWallet, {});

      const program = new anchor.Program(
        HatchIDL.IDL,
        mints.HATCHER_PROGRAM_ID,
        provider
      );

      const program2 = new anchor.Program(
        HatchIDL.IDL,
        mints.HATCHER_PROGRAM_ID,
        provider2
      );

      setHatcherFakeProgram(program);
      setHatcherRealProgram(program2);
    }
  }, [connection, connected, publicKey]);

  return (
    <HatcherContext.Provider
      value={{
        hatcherRealProgram,
        hatcherFakeProgram,
      }}
    >
      {children}
    </HatcherContext.Provider>
  );
}
