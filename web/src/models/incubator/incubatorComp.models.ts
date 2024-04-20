import React from "react";
import * as eggs from "assets/eggs";
import * as models from "models";
import { PublicKey } from "@solana/web3.js";

export type IIncubatorVendingMachineViews =
  | "HOME"
  | "MENU"
  | "MINT"
  | "TRANSITION"
  | "REVEAL";

export type IEggRarities = "BLUE" | "GREEN" | "PURPLE" | "MYTHICAL";

export type IIncubatorStatus = "READY" | "MINTING" | "DONE";

export type IIncubatorVendingMachineViewMap = {
  [key in IIncubatorVendingMachineViews]: {
    comp: React.FC<any>;
  };
};

export type IIncubatorVendingMachineSwitch = {
  SFT: IIncubatorVendingMachineViewMap;
  NFT: IIncubatorVendingMachineViewMap;
};

export type IEggRaritiesMap = {
  [key in IEggRarities]: {
    eggAnimation: string;
    eggAsset: string;
    mint: PublicKey;
    name: string;
    rarityColor: string;
  };
};

export type IEggCrackSeqMap = {
  [key in IEggRarities]: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
};

export type IEggBalancesMap = {
  [key in IEggRarities]: {
    balance: number;
  };
};

export interface IIncubatorVendingMachineViewState {
  view: IIncubatorVendingMachineViews;
  idx: number;
}

export interface IIncubatorVendingMachineViewProps {
  onNext?: () => void;
  onComplete: () => void;
  onPrev: () => void;
  onSwitch: (switchValue: number) => void;
  onMint: (amount: number) => void;
  onHatch: (egg: models.IEggRarities) => void;
  onRedeem: () => Promise<void>;
  onRedeemNft: () => Promise<void>;
  dinoNft: any;
  dinoAttributes: any;
  eggRarity: IEggRarities;
  hatchEgg: IEggRarities;
  showPrev: boolean;
  isLastView: boolean;
}

export type IEgg = {
  id: number;
  name: string;
  eggAsset: string;
  balance: number;
};

export interface IEggHook {
  timer: number;
  eggToHatch: IEgg;
}

export interface ISelectEggForm {
  egg: IEggRarities;
}
