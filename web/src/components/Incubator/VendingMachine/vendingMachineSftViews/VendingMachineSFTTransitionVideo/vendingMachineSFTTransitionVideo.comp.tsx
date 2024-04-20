import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "antd";

import * as assets from "assets";
import * as eggs from "assets/eggs";
import * as models from "models";

import * as globalComps from "components/Global";

import * as styled from "./vendingMachineSFTTransitionVideo.styles";

export interface IVendingMachineSFTTransitionVideoInterface
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineSFTTransitionVideoComp: FC<
  IVendingMachineSFTTransitionVideoInterface
> = ({ eggRarity, onNext, onRedeem }) => {
  const [isAnimated, setAnimated] = useState<boolean>(false);
  const [isRedeemableHidden, setIsRedeemableHidden] = useState<boolean>(true);

  useEffect(() => {
    if (eggRarity) {
      setIsRedeemableHidden(false);
    }
  }, [eggRarity]);

  const handleRedeem = async () => {
    setIsRedeemableHidden(true);
    await onRedeem();
    setAnimated(true);
    switchViews();
  };

  const switchViews = async () => {
    await new Promise(function (resolve) {
      setTimeout(resolve, 1900);
    });
    onNext && onNext();
  };

  return (
    <styled.VendingMachineSFTTransitionVideoComp>
      <styled.VendingMachineSFTVideo autoPlay muted loop={true}>
        <source src={assets.EGG_ANIMATION} type="video/mp4" />
      </styled.VendingMachineSFTVideo>
      <styled.VendingMachineSFTVideoFader isAnimated={isAnimated}>
        <styled.VendingMachineSFTTransitionContainer>
          <globalComps.PrimaryButton
            className="btn-ls btn-claim"
            hidden={isRedeemableHidden}
            onClick={() => {
              handleRedeem();
            }}
          >
            Redeem
          </globalComps.PrimaryButton>
        </styled.VendingMachineSFTTransitionContainer>
      </styled.VendingMachineSFTVideoFader>
    </styled.VendingMachineSFTTransitionVideoComp>
  );
};
