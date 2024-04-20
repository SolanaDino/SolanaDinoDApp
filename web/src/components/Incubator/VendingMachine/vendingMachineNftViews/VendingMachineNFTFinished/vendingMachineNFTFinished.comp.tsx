import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "antd";

import * as models from "models";
import * as assets from "assets";
import * as eggs from "assets/eggs";

import * as consts from "../../../IncubatorInterface.const";
import * as styled from "./vendingMachineNFTFinished.styles";

export interface IVendingMachineNFTFinished
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineNFTFinishedComp: FC<IVendingMachineNFTFinished> = ({
  hatchEgg,
  dinoAttributes,
  onComplete,
}) => {
  return (
    <styled.VendingMachineNFTTransitionVideoComp onClick={onComplete}>
      <styled.VendingMachineNFTVideo>
        <img src={dinoAttributes.image} />
      </styled.VendingMachineNFTVideo>
      <styled.VendingMachineNFTFinishedText
        color={consts.EGG_RARITIES_MAP[hatchEgg].rarityColor}
      >
        <div>You got {dinoAttributes.name}!</div>
      </styled.VendingMachineNFTFinishedText>
      <styled.VendingMachineNFTFinishedSubText>
        - Click to continue -
      </styled.VendingMachineNFTFinishedSubText>
    </styled.VendingMachineNFTTransitionVideoComp>
  );
};
