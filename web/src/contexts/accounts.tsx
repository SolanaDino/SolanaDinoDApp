import React, {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as web3 from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import * as mints from "consts/mints";
import * as models from "models";
import * as actions from "actions";

export interface IAccountsContext {
  ataMap: Map<string, models.ITokenAccount>;
  tokenAccounts: models.ISplAccounts[];
  solBalance: number;
}

const AccountsContext = React.createContext<IAccountsContext>({
  ataMap: new Map(),
  tokenAccounts: [],
  solBalance: 0,
});

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);

  return context;
};

export const AccountsProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const [tokenAccounts, setTokenAccounts] = useState<models.ISplAccounts[]>([]);
  const [userAccounts, setUserAccounts] = useState<models.ISplAccounts[]>([]);
  const [solBalance, setSolBalance] = useState<number>(0);

  const [ataMap, setAtaMap] = useState<Map<string, models.ITokenAccount>>(
    new Map()
  );

  useEffect(() => {
    if (!connected || !publicKey) {
      setAtaMap(new Map());
      setTokenAccounts([]);
      setUserAccounts([]);
    }
  }, [connection, connected, publicKey]);

  useEffect(() => {
    if (publicKey) {
      getWalletInfo(publicKey, connection);
      getSolBalance(publicKey, connection);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (connection && publicKey) {
      const tokenSubID = connection.onAccountChange(
        publicKey,
        async () => {
          await getWalletInfo(publicKey, connection);
        },
        "finalized"
      );

      return () => {
        connection.removeAccountChangeListener(tokenSubID);
      };
    }
  }, [connection, connected, publicKey]);

  const getSolBalance = async (
    walletKey: web3.PublicKey,
    connection: web3.Connection
  ) => {
    const lamportsBalance = await connection.getBalance(walletKey);
    setSolBalance(lamportsBalance / web3.LAMPORTS_PER_SOL);
  };

  const getWalletInfo = async (
    walletKey: web3.PublicKey,
    connection: web3.Connection
  ) => {
    const tokenAccounts = (
      await connection.getParsedTokenAccountsByOwner(
        walletKey,
        {
          programId: TOKEN_PROGRAM,
        },
        "single"
      )
    ).value;

    setTokenAccounts(tokenAccounts);

    const mints = tokenAccounts.map(
      (account) =>
        new web3.PublicKey(account.account.data.parsed.info.mint as string)
    );

    setAtaMap(await getAssociatedTokenAddressMap(walletKey, connection, mints));
  };

  return (
    <AccountsContext.Provider
      value={{
        tokenAccounts,
        // userAccounts,
        ataMap,
        solBalance,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const TOKEN_PROGRAM = new web3.PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const getAssociatedTokenAddressMap = async (
  walletKey: web3.PublicKey,
  connection: web3.Connection,
  _mints: web3.PublicKey[]
): Promise<Map<string, models.ITokenAccount>> => {
  const ataMap = new Map<string, models.ITokenAccount>();

  for (const mint of mints.TOKEN_LIST) {
    const ataAccount = await actions.getAssociatedTokenAccount(
      mint,
      walletKey,
      connection
    );

    ataMap.set(mint.toString(), ataAccount as models.ITokenAccount);
  }
  return ataMap;
};
