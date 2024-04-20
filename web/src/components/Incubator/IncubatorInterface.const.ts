import * as models from "models";
import * as eggs from "assets/eggs";
import * as mints from "consts/mints";

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
