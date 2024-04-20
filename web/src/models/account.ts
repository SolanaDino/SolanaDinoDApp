import * as web3 from "@solana/web3.js";

import { TOKEN_PROGRAM_ID } from "../utils/ids";

// export interface TokenAccount {
//   pubkey: PublicKey;
//   account: AccountInfo<Buffer>;
//   info: TokenAccountInfo;
// }

export type ISplAccounts = {
  pubkey: web3.PublicKey;
  account: web3.AccountInfo<IParsedTokenAccount>;
};

export type ITokenAccount = {
  pubkey: string;
  ataInfo?: IParsedTokenAccount;
};

export type IParsedTokenAccount = {
  program: string;
  parsed: IParsedTokenAccountData;
  space: number;
};

export type IParsedTokenAccountData = {
  info: IParsedTokenAccountInfo;
  type: string;
};

export type IParsedTokenAccountInfo = {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: IParsedTokenAccountBalance;
};

export type IParsedTokenAccountBalance = {
  amount: number;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
};

export interface StakingAccounts {
  stakeAcctNew: web3.PublicKey;
  stakeAcctNewInfo?: any;
  stakeAcctOld: web3.PublicKey;
  stakeAcctOldInfo?: any;
}

export interface LoveshackAccounts {
  holdingAcct: web3.PublicKey;
  stakePool: number;
  authAcct?: web3.PublicKey;
}

export interface StakingCard {
  stakedMintABalance: number;
  unstakedMintABalance: number;
  stakedMintAPercentage: number;
  mintAPoolSize: string;
  earnedMintBBalance?: string;
  currentEarningRate?: string;
  estimatedMintBEarn?: string;
  estimatedMintBStakeTime?: string;
  claimedMintBBalance?: string;
}

export interface DinoTokenBalances {
  dinoBalance: number;
  eggBalance: number;
  dinoRayBalance: number;
  dinoStepBalance: number;
}

export interface SummaryCard {
  researchDaysLeft: string;
  unClaimedEgg: string;
  triceratopsBonus: boolean;
  calibrationBonus: boolean;
}
