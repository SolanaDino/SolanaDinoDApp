import * as models from "models";
import * as vendingMachineSftViews from "./vendingMachineSftViews";
import * as vendingMachineNftViews from "./vendingMachineNftViews";
import { VendingMachineHomeComp } from "./vendingMachineHome";
import * as eggs from "assets/eggs";
import * as mints from "consts/mints";

export const INIT_VIEW: models.IIncubatorVendingMachineViewState = {
  view: "HOME",
  idx: 0,
};

export const TRANSITION_VIEW: models.IIncubatorVendingMachineViewState = {
  view: "TRANSITION",
  idx: 3,
};

export const NFT_REVEAL_VIEW: models.IIncubatorVendingMachineViewState = {
  view: "REVEAL",
  idx: 6,
};

export const CREATE_VENDING_MACHINE_SFT_VIEW_MAP: models.IIncubatorVendingMachineViewMap =
  {
    HOME: {
      comp: VendingMachineHomeComp,
    },
    MENU: {
      comp: vendingMachineSftViews.VendingMachineSFTMenuScreenComp,
    },
    MINT: {
      comp: vendingMachineSftViews.VendingMachineMintSFTComp,
    },
    TRANSITION: {
      comp: vendingMachineSftViews.VendingMachineSFTTransitionVideoComp,
    },
    REVEAL: {
      comp: vendingMachineSftViews.VendingMachineSFTFinishedComp,
    },
  };

export const CREATE_VENDING_MACHINE_NFT_VIEW_MAP: models.IIncubatorVendingMachineViewMap =
  {
    HOME: {
      comp: VendingMachineHomeComp,
    },
    MENU: {
      comp: vendingMachineNftViews.VendingMachineNftMenuScreenComp,
    },
    MINT: {
      comp: vendingMachineNftViews.VendingMachineMintNFTComp,
    },
    TRANSITION: {
      comp: vendingMachineNftViews.VendingMachineNFTTransitionVideoComp,
    },
    REVEAL: {
      comp: vendingMachineNftViews.VendingMachineNFTFinishedComp,
    },
  };

export const MAPS: models.IIncubatorVendingMachineSwitch = {
  SFT: CREATE_VENDING_MACHINE_SFT_VIEW_MAP,
  NFT: CREATE_VENDING_MACHINE_NFT_VIEW_MAP,
};

export const EGGS: models.IEgg[] = [
  {
    id: 0,
    name: "Blue Egg",
    eggAsset: eggs.BLUE_DINO_EGG,
    balance: 0,
  },
  {
    id: 1,
    name: "Green Egg",
    eggAsset: eggs.GREEN_DINO_EGG,
    balance: 0,
  },
  {
    id: 2,
    name: "Purple Egg",
    eggAsset: eggs.PURPLE_DINO_EGG,
    balance: 0,
  },
  {
    id: 3,
    name: "Mythical Egg",
    eggAsset: eggs.MYTHICAL_DINO_EGG,
    balance: 0,
  },
];

export const EGG_RARITIES_MAP: models.IEggRaritiesMap = {
  BLUE: {
    eggAnimation: eggs.BLUE_DINO_EGG_REVEAL,
    eggAsset: eggs.BLUE_DINO_EGG,
    mint: mints.NFT1,
    name: "Blue Egg",
    rarityColor: "#306DA9",
  },
  GREEN: {
    eggAnimation: eggs.GREEN_DINO_EGG_REVEAL,
    eggAsset: eggs.GREEN_DINO_EGG,
    mint: mints.NFT2,
    name: "Green Egg",
    rarityColor: "#3D8433",
  },
  PURPLE: {
    eggAnimation: eggs.PURPLE_DINO_EGG_REVEAL,
    eggAsset: eggs.PURPLE_DINO_EGG,
    mint: mints.NFT3,
    name: "Purple Egg",
    rarityColor: "#632F8D",
  },
  MYTHICAL: {
    eggAnimation: eggs.MYTHICAL_DINO_EGG,
    eggAsset: eggs.MYTHICAL_DINO_EGG,
    mint: mints.NFT4,
    name: "Mythical Egg",
    rarityColor: "#958CDF",
  },
};
