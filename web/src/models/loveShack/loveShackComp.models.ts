import React from "react";
import { PublicKey } from "@solana/web3.js";

export type IStakingTypes = "DINO" | "STEP" | "RAYDIUM";

export interface IStakingTypeMap {
  poolName: string;
  link: string;
  linkPop: string;
  linkUrl: string;
  tokenInitials: string;
  logo: string;
}

export interface IStakingButtonMap {
  isLp: boolean;
  linkUrl: string;
  mint: PublicKey;
}
