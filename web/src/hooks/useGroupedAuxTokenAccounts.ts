import { useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

import * as hooks from "hooks";
import * as consts from "consts";
import * as models from "models";

export function useGroupedAuxTokenAccounts() {
  const { userAccounts } = hooks.useUserAccounts();
  const { ataMap } = hooks.useAssociatedTokenAccounts();
  const groupedTokenAccounts = new Map<string, models.ISplAccounts[]>();
  const { publicKey } = useWallet();

  for (const account of userAccounts) {
    const mint = new web3.PublicKey(account.account.data.parsed.info.mint);
    const ata = ataMap.get(mint.toString());
    if (account.pubkey == publicKey) {
      continue;
    }
    if (
      (mint === consts.DINO_MINT || mint === consts.EGG_MINT) &&
      account.pubkey.toString() !== ata?.pubkey.toString()
    ) {
      var fetchedAccounts = groupedTokenAccounts.get(mint.toString()) ?? [];
      fetchedAccounts.push(account);
      groupedTokenAccounts.set(mint.toString(), fetchedAccounts);
    }
  }

  return groupedTokenAccounts;
}
