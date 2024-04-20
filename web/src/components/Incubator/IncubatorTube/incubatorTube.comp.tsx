import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import * as hooks from "hooks";
import * as incubatorUtils from "utils/incubator.utils";

import * as consts from "../IncubatorInterface.const";
import * as assets from "assets";
import * as styled from "./incubatorTube.styles";

export interface IIncubatorTubeComp {}

export const IncubatorTubeComp: FC<IIncubatorTubeComp> = ({}) => {
  const nftBalances = hooks.useEggNFTBalance();
  const [eggImg, setEggImg] = useState<string>(assets.RAW_DINO_EGG);

  useEffect(() => {
    const rarity = incubatorUtils.getRareEgg(nftBalances);
    if (rarity) {
      setEggImg(consts.EGG_RARITIES_MAP[rarity].eggAsset);
    }
  }, [nftBalances]);

  return (
    <styled.IncubatorTube bgImg={assets.INCUBATOR}>
      <styled.IncubatorHoveringEgg>
        <img src={eggImg} alt="hovering_egg" />
      </styled.IncubatorHoveringEgg>
    </styled.IncubatorTube>
  );
};
