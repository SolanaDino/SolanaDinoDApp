import { PublicKey } from "@solana/web3.js";

import { useLoveShackContext } from "contexts/loveshack";

import * as models from "models";

export const useLsAccountByMint = (stakingType: models.IStakingTypes) => {
  const context = useLoveShackContext();

  if (stakingType == "DINO") {
    return {
      dinoLsAccts: context.dinoLsAccts as models.LoveshackAccounts,
    };
  } else if (stakingType == "RAYDIUM") {
    return {
      dinoLsAccts: context.raydiumLsAccts as models.LoveshackAccounts,
    };
  } else if (stakingType == "STEP") {
    return {
      dinoLsAccts: context.stepLsAccts as models.LoveshackAccounts,
    };
  }

  return;
};
