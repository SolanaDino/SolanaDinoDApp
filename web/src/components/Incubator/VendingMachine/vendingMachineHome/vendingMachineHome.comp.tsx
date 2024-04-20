import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, Popover, Slider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import * as models from "models";
import * as globalComps from "components/Global";

import * as styled from "./vendingMachineHome.styles";
import { ToastContainer } from "react-toastify";

export interface IVendingMachineHomeProps
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineHomeComp: FC<IVendingMachineHomeProps> = ({
  onSwitch,
}) => {
  return (
    <styled.VendingMachineNFTMenuScreenComp>
      <styled.VendingMachineNFTMenuScreenHeader>
        <styled.VendingMachineNFTMenuScreenHeaderTitle>
          Welcome
        </styled.VendingMachineNFTMenuScreenHeaderTitle>
      </styled.VendingMachineNFTMenuScreenHeader>
      <styled.VendingMachineNFTMenuScreenContent>
        <styled.VendingMachineNFTMenuScreenContentTitle>
          <h3>Welcome to the Incubator!</h3>
        </styled.VendingMachineNFTMenuScreenContentTitle>
        <styled.VendingMachineNFTMenuScreenContentLore>
          <span>Connect your wallet and choose what you want to do!</span>
        </styled.VendingMachineNFTMenuScreenContentLore>
        <styled.VendingMachineNFTHomeContentButton>
          <globalComps.PrimaryButton
            className="btn-ls"
            onClick={() => onSwitch(0)}
          >
            Mint your DinoEgg
          </globalComps.PrimaryButton>
        </styled.VendingMachineNFTHomeContentButton>
        {/* <Popover placement="bottom" content={"September 24th!"} trigger="hover"> */}
        <styled.VendingMachineNFTHomeContentButton>
          <globalComps.PrimaryButton
            onClick={() => onSwitch(1)}
            className="btn-ls"
          >
            Hatch your DinoEgg
          </globalComps.PrimaryButton>

          {/* onClick={() => onSwitch(1)} */}
        </styled.VendingMachineNFTHomeContentButton>
        {/* </Popover> */}
      </styled.VendingMachineNFTMenuScreenContent>
    </styled.VendingMachineNFTMenuScreenComp>
  );
};
