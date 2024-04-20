import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "antd";

import * as models from "models";
import * as assets from "assets";
import * as eggs from "assets/eggs";

import * as consts from "../../../IncubatorInterface.const";
import * as styled from "./vendingMachineSFTFinished.styles";

export interface IVendingMachineSFTFinished
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineSFTFinishedComp: FC<IVendingMachineSFTFinished> = ({
  eggRarity,
  onComplete,
}) => {
  return (
    <styled.VendingMachineSFTTransitionVideoComp onClick={onComplete}>
      <styled.VendingMachineSFTVideo autoPlay muted>
        <source
          src={consts.EGG_RARITIES_MAP[eggRarity].eggAnimation}
          type="video/mp4"
        />
      </styled.VendingMachineSFTVideo>
      <styled.VendingMachineSFTFinishedText
        color={consts.EGG_RARITIES_MAP[eggRarity].rarityColor}
      >
        You got a <span>{eggRarity}</span> egg!
      </styled.VendingMachineSFTFinishedText>
      <styled.VendingMachineSFTFinishedSubText>
        - Click to continue -
      </styled.VendingMachineSFTFinishedSubText>
    </styled.VendingMachineSFTTransitionVideoComp>
  );
};
