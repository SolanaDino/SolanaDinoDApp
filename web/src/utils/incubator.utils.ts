import { AccountInfo } from "@solana/web3.js";
import { BN, utils } from "@project-serum/anchor";

import * as models from "models";

export function* getSlotHashes(account: AccountInfo<Buffer>) {
  let len = new BN(account.data.slice(0, 8), "le").toNumber();
  let i = 0;
  while (i < len) {
    yield [
      new BN(account.data.slice(8 + i * 40, 8 + i * 40 + 8), "le").toNumber(),
      utils.bytes.bs58.encode(
        account.data.slice(8 + i * 40 + 8, 8 + i * 40 + 40)
      ),
    ];
    i++;
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getRareEgg = (nftBalances: models.NFTBalances) => {
  let eggRarity;
  if (nftBalances.balanceNFT4) {
    eggRarity = "MYTHICAL" as models.IEggRarities;
  } else if (nftBalances.balanceNFT3) {
    eggRarity = "PURPLE" as models.IEggRarities;
  } else if (nftBalances.balanceNFT2) {
    eggRarity = "GREEN" as models.IEggRarities;
  } else if (nftBalances.balanceNFT1) {
    eggRarity = "BLUE" as models.IEggRarities;
  }

  return eggRarity;
};
