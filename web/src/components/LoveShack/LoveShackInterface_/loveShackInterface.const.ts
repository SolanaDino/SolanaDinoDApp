import * as models from "models";
import * as assets from "assets";

const POOL_NAME_DINO = "Love Shack DINO pool";
const POOL_NAME_RAYDIUM = "Raydium USDC-DINO pool";
const POOL_NAME_STEP = "Step STEP-DINO pool";

const LINK_TO_DINO = "Link to DINO Dex: ";
const LINK_TO_RAYDIUM = "Link to Raydium pool: ";
const LINK_TO_STEP = "Link to Step pool: (deprecated) ";

const LINK_URL_DINO =
  "https://dex.solanadino.com/#/market/AC11orBo1k5PFPyhjTj9o4KjcwD9b95hauSRtExy8eKv";
const LINK_URL_STEP = "https://app.step.finance/en/liquidity/add";
const LINK_URL_RAYDIUM =
  "https://raydium.io/liquidity/?ammId=FfQvPJXGfzArLqhcbjRTkkfYG3xoubH5c8iDfm7g5Jy";

const LINK_TO_POP_DINO =
  "Buy and Sell DINO on the DINO Dex using Serum markets.";
const LINK_TO_POP_STEP =
  "Step's AMM will be deprecated soon. Please remove your liquidity from the DINO/STEP pool.";
const LINK_TO_POP_RAYDIUM =
  "Add liquidity to the USDC-DINO Raydium pool and deposit your LP tokens here to receive additional DINOEGG. LP tokens staked here will receive a DINOEGG research bonus.";

const TOKEN_INITIALS_DINO = "DINO";
const TOKEN_INITIALS_STEP = "LP (STEP)";
const TOKEN_INITIALS_RAYDIUM = "LP (RAY)";

export const DETAILS_STAKETYPE_MAP: {
  [key in models.IStakingTypes]: models.IStakingTypeMap;
} = {
  DINO: {
    poolName: POOL_NAME_DINO,
    link: LINK_TO_DINO,
    linkPop: LINK_TO_POP_DINO,
    linkUrl: LINK_URL_DINO,
    tokenInitials: TOKEN_INITIALS_DINO,
    logo: assets.DINO_ICON,
  },
  STEP: {
    poolName: POOL_NAME_STEP,
    link: LINK_TO_STEP,
    linkPop: LINK_TO_POP_STEP,
    linkUrl: LINK_URL_STEP,
    tokenInitials: TOKEN_INITIALS_STEP,
    logo: assets.STEP_ICON,
  },
  RAYDIUM: {
    poolName: POOL_NAME_RAYDIUM,
    link: LINK_TO_RAYDIUM,
    linkPop: LINK_TO_POP_RAYDIUM,
    linkUrl: LINK_URL_RAYDIUM,
    tokenInitials: TOKEN_INITIALS_RAYDIUM,
    logo: assets.RAYDIUM_ICON,
  },
};
