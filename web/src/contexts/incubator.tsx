import React, { useContext, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";

import * as mints from "consts/mints";

const IncubatorContext = React.createContext<any>(null);

export const useIncubatorContext = () => {
  const context = useContext(IncubatorContext);

  return context;
};

export function IncubatorProvider({ children = null as any }) {
  const { connection } = useConnection();
  const { publicKey, connected, signTransaction } = useWallet();
  const [incubatorProgram, setIncubatorProgram] = useState<anchor.Program>();

  useEffect(() => {
    if (connection && connected && publicKey) {
      const hackyWallet = {
        publicKey: publicKey,
        signTransaction: signTransaction,
      } as any;

      const provider = new anchor.AnchorProvider(
        connection,
        hackyWallet,
        new Object()
      );

      anchor.Program.fetchIdl(mints.INCUBATOR_PROGRAM_ID, provider).then(
        (idl) => {
          if (idl) {
            setIncubatorProgram(
              new anchor.Program(idl, mints.INCUBATOR_PROGRAM_ID, provider)
            );
          }
        }
      );
    }
  }, [connection, connected, publicKey]);

  return (
    <IncubatorContext.Provider
      value={{
        incubatorProgram,
      }}
    >
      {children}
    </IncubatorContext.Provider>
  );
}
