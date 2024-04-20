import * as models from "models";
import * as consts from "consts";

const LINK_URL_DINO =
  "https://dex.solanadino.com/#/market/AC11orBo1k5PFPyhjTj9o4KjcwD9b95hauSRtExy8eKv";
const LINK_URL_STEP =
  "https://app.step.finance/#/liquidity/add?a=6Y7LbYB3tfGBG6CSkyssoxdtHb77AEMTRVXe8JUJRwZ7&b=StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT";
const LINK_URL_RAYDIUM =
  "https://raydium.io/liquidity/?ammId=FfQvPJXGfzArLqhcbjRTkkfYG3xoubH5c8iDfm7g5Jy";

export const DETAILS_STAKETYPE_MAP: {
  [key in models.IStakingTypes]: models.IStakingButtonMap;
} = {
  DINO: {
    isLp: false,
    linkUrl: LINK_URL_DINO,
    mint: consts.DINO_MINT,
  },
  STEP: {
    isLp: true,
    linkUrl: LINK_URL_STEP,
    mint: consts.DINO_STEPLP_MINT,
  },
  RAYDIUM: {
    isLp: true,
    linkUrl: LINK_URL_RAYDIUM,
    mint: consts.DINO_RAYDIUMLP_MINT,
  },
};
