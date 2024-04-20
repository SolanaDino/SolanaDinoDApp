import React, { useContext, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Provider, Program, AnchorProvider } from "@project-serum/anchor";

import * as models from "models";
import * as mints from "consts/mints";
import { useAccountsContext } from "./accounts";

const LoveShackContext = React.createContext<any>(null);

export const useLoveShackContext = () => {
  const context = useContext(LoveShackContext);

  return context;
};

export function LoveShackProvider({ children = null as any }) {
  const { connection } = useConnection();
  const { tokenAccounts } = useAccountsContext();
  const { publicKey, connected, signTransaction } = useWallet();

  const [loveShackProgram, setLoveshackProgram] = useState<Program>();
  const [dinoLsAccts, setDinoLsAccts] = useState<models.LoveshackAccounts>();
  const [raydiumLsAccts, setRaydiumLsAccts] =
    useState<models.LoveshackAccounts>();
  const [stepLsAccts, setStepLsAccts] = useState<models.LoveshackAccounts>();
  const [stakingAccts, setStakingAccts] = useState<models.StakingAccounts>();

  useEffect(() => {
    if (loveShackProgram && stakingAccts?.stakeAcctNew) {
      const timer = setTimeout(() => {
        loveShackProgram.account.stakeAccount
          .fetch(stakingAccts?.stakeAcctNew)
          .then((value) => {
            if (stakingAccts) {
              setStakingAccts({
                ...stakingAccts,
                stakeAcctNewInfo: value,
              });
            }
          })
          .catch((error) => {
            // insert toast
            console.log("No staking account yet");
          });
      }, 15000);
      // Clear timeout if the component is unmounted
      return () => clearTimeout(timer);
    }
  });

  useEffect(() => {
    if (connection && connected && publicKey) {
      const hackyWallet = {
        publicKey: publicKey,
        signTransaction: signTransaction,
      } as any;

      const provider = new AnchorProvider(
        connection,
        hackyWallet,
        new Object()
      );
      Program.fetchIdl(mints.LS_PROGRAM_ID, provider).then((idl) => {
        if (idl) {
          setLoveshackProgram(new Program(idl, mints.LS_PROGRAM_ID, provider));
        }
      });
    }
  }, [connection, connected, publicKey]);

  useEffect(() => {
    if (loveShackProgram && publicKey) {
      initDinoPool(loveShackProgram);
      initRaydiumPool(loveShackProgram);
      initStepPool(loveShackProgram);
      initStakingAccts(loveShackProgram, publicKey);
    }
  }, [loveShackProgram, publicKey]);

  useEffect(() => {
    if (loveShackProgram && publicKey) {
      initStakingAccts(loveShackProgram, publicKey);
    }
  }, [loveShackProgram, publicKey, tokenAccounts]);

  const initStakingAccts = async (
    loveShackProgram: Program,
    publicKey: PublicKey
  ) => {
    const oldStakeAcct =
      await loveShackProgram.account.stakeAccount.associatedAddress(
        publicKey,
        mints.DINO_MINT,
        mints.EGG_MINT
      );

    const [newStakeAcct] = await PublicKey.findProgramAddress(
      [
        publicKey.toBuffer(),
        mints.EGG_MINT.toBuffer(),
        mints.DINO_MINT.toBuffer(),
      ],
      mints.LS_PROGRAM_ID
    );

    var oldStakeAcctInfo = await loveShackProgram.account.stakeAccount
      .fetch(oldStakeAcct)
      .catch(() => undefined);

    var newStakeAcctInfo = await loveShackProgram.account?.stakeAccountV2
      .fetch(newStakeAcct)
      .catch((error) => undefined);

    setStakingAccts({
      stakeAcctOld: oldStakeAcct,
      stakeAcctOldInfo: oldStakeAcctInfo,
      stakeAcctNew: newStakeAcct,
      stakeAcctNewInfo: newStakeAcctInfo,
    });
  };

  const initRaydiumPool = async (loveShackProgram: Program) => {
    const holdingAcct = await PublicKey.findProgramAddress(
      [Buffer.from("holding"), mints.DINO_RAYDIUMLP_MINT.toBuffer()],
      loveShackProgram.programId
    ).catch(() => {
      console.log("Failed to retrieve holding acct");
    });

    if (holdingAcct) {
      const pool = await connection.getTokenAccountBalance(holdingAcct[0]);
      const authAcct = await PublicKey.findProgramAddress(
        [Buffer.from("minting"), mints.EGG_MINT.toBuffer()],
        loveShackProgram.programId
      ).catch((error) => [undefined]);
      setRaydiumLsAccts({
        holdingAcct: holdingAcct[0],
        authAcct: authAcct[0],
        stakePool: pool?.value?.uiAmount ?? 0,
      });
    }
  };

  const initStepPool = async (loveShackProgram: Program) => {
    const holdingAcct = await PublicKey.findProgramAddress(
      [Buffer.from("holding"), mints.DINO_STEPLP_MINT.toBuffer()],
      loveShackProgram.programId
    ).catch(() => {
      console.log("Failed to retrieve holding acct");
    });

    if (holdingAcct) {
      const pool = await connection.getTokenAccountBalance(holdingAcct[0]);
      const authAcct = await PublicKey.findProgramAddress(
        [Buffer.from("minting"), mints.EGG_MINT.toBuffer()],
        loveShackProgram.programId
      ).catch((error) => [undefined]);
      setStepLsAccts({
        holdingAcct: holdingAcct[0],
        authAcct: authAcct[0],
        stakePool: pool?.value?.uiAmount ?? 0,
      });
    }
  };

  const initDinoPool = async (loveShackProgram: Program) => {
    const holdingAcct = await PublicKey.findProgramAddress(
      [Buffer.from("holding"), mints.DINO_MINT.toBuffer()],
      loveShackProgram.programId
    ).catch(() => undefined);

    const pool =
      holdingAcct && (await connection.getTokenAccountBalance(holdingAcct[0]));

    const authAcct = await PublicKey.findProgramAddress(
      [Buffer.from("minting"), mints.EGG_MINT.toBuffer()],
      loveShackProgram.programId
    ).catch(() => undefined);

    holdingAcct &&
      setDinoLsAccts({
        holdingAcct: holdingAcct[0],
        authAcct: authAcct && authAcct[0],
        stakePool: pool?.value.uiAmount ?? 0,
      });
  };

  return (
    <LoveShackContext.Provider
      value={{
        loveShackProgram,
        dinoLsAccts,
        raydiumLsAccts,
        stepLsAccts,
        stakingAccts,
      }}
    >
      {children}
    </LoveShackContext.Provider>
  );
}
