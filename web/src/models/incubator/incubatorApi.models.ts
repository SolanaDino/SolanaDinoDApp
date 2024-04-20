import React from "react";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { IEggRarities } from ".";

export interface IncubatorAccounts {
  incubatorAcct: any;
  incubator?: [PublicKey, number];
  winningMintRarity?: IEggRarities;
}

export interface NFTBalances {
  balanceNFT1: number;
  balanceNFT2: number;
  balanceNFT3: number;
  balanceNFT4: number;
}
