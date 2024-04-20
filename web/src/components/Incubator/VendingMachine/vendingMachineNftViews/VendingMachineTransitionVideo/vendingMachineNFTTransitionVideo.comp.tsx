import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, Modal, Popover } from "antd";

import * as assets from "assets";
import * as eggs from "assets/eggs";
import * as globalComps from "components/Global";
import * as models from "models";

import * as styled from "./vendingMachineNFTTransitionVideo.styles";
import { useTimer } from "hooks/timer";
import { EggAnimationComp } from "./eggAnimation/eggAnimation.comp";

export interface IVendingMachineNFTTransitionVideoInterface
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineNFTTransitionVideoComp: FC<
  IVendingMachineNFTTransitionVideoInterface
> = ({ hatchEgg, dinoNft, onNext, onRedeemNft }) => {
  const [isAnimated, setAnimated] = useState<boolean>(false);
  const [isRedeemableHidden, setIsRedeemableHidden] = useState<boolean>(true);
  const timer = useTimer();

  useEffect(() => {
    if (hatchEgg) {
      setIsRedeemableHidden(false);
    }
  }, [hatchEgg]);

  const handleRedeem = async () => {
    setIsRedeemableHidden(true);
    await onRedeemNft();
    // setAnimated(true);
    // switchViews();
  };

  const switchViews = async () => {
    await new Promise(function (resolve) {
      setTimeout(resolve, 1900);
    });
    onNext && onNext();
  };

  return (
    <styled.VendingMachineNFTTransitionVideoComp>
      <styled.VendingMachineMintNFTHeader>
        <styled.VendingMachineMintNFTHeaderTitle>
          Click the egg to hatch!
        </styled.VendingMachineMintNFTHeaderTitle>
      </styled.VendingMachineMintNFTHeader>
      <styled.VendingMachineNFTVideoEggComp>
        <EggAnimationComp
          timer={timer}
          eggToHatch={hatchEgg}
          isReady={true}
        ></EggAnimationComp>
        {dinoNft !== -1 && (
          <globalComps.PrimaryButton onClick={() => handleRedeem()}>
            Redeem
          </globalComps.PrimaryButton>
        )}
        {/* <Egg timer={timer} eggToHatch={hatchEgg}></Egg> */}
      </styled.VendingMachineNFTVideoEggComp>
    </styled.VendingMachineNFTTransitionVideoComp>
  );
};
