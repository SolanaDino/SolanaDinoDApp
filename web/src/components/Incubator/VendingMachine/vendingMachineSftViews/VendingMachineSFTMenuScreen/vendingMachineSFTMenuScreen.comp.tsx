import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, Slider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { messageToast } from "utils/toast";
import * as eggs from "assets/eggs";
import * as hooks from "hooks";
import * as models from "models";

import * as globalComps from "components/Global";

import * as styled from "./vendingMachineSFTMenuScreen.styles";
import { ToastContainer } from "react-toastify";

export interface IVendingMachineSFTMenuScreenInterface
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineSFTMenuScreenComp: FC<
  IVendingMachineSFTMenuScreenInterface
> = ({ onNext }) => {
  const { balanceEgg } = hooks.useEggBalance();
  const { incubatorProgram } = hooks.useIncubatorProgram();

  const { publicKey } = useWallet();

  const handleStart = () => {
    if (!publicKey || !incubatorProgram) {
      messageToast("error", "Wallet not connected.");
    } else if (balanceEgg == 0) {
      messageToast("info", "You need minimum 1 EGG to generate an EGG NFT.");
      // toaster
    } else {
      onNext && onNext();
    }
  };

  return (
    <>
      <styled.VendingMachineSFTMenuScreenComp>
        <styled.VendingMachineSFTMenuScreenHeader>
          <styled.VendingMachineSFTMenuScreenHeaderTitle>
            Minting
          </styled.VendingMachineSFTMenuScreenHeaderTitle>
          <styled.VendingMachineSFTMenuScreenHeaderBalance>
            Balance: {Math.round(balanceEgg * 100) / 100}
          </styled.VendingMachineSFTMenuScreenHeaderBalance>
        </styled.VendingMachineSFTMenuScreenHeader>
        <styled.VendingMachineSFTMenuScreenContent>
          <styled.VendingMachineSFTMenuScreenContentTitle>
            <h3>Welcome to the Incubator!</h3>
          </styled.VendingMachineSFTMenuScreenContentTitle>
          <styled.VendingMachineSFTMenuScreenContentLore>
            <span>
              Now that we have enough genetic material to construct viable dino
              eggs, it's time to start resurrecting the dinosaurs!
            </span>
          </styled.VendingMachineSFTMenuScreenContentLore>
          <styled.VendingMachineSFTMenuScreenContentDescription>
            <span>
              To intiate the incubator you will need at least 1 DINOEGG token.
            </span>
          </styled.VendingMachineSFTMenuScreenContentDescription>

          <styled.VendingMachineSFTMenuEggs>
            <styled.EggIcon src={eggs.GREEN_DINO_EGG} />
            <styled.EggIcon src={eggs.BLUE_DINO_EGG} />
            <styled.EggIcon src={eggs.PURPLE_DINO_EGG} />
          </styled.VendingMachineSFTMenuEggs>
          <styled.VendingMachineSFTMenuScreenContentNote>
            <span>Important: </span>Do not click away during minting!
          </styled.VendingMachineSFTMenuScreenContentNote>
          <styled.VendingMachineSFTMenuButtom>
            <globalComps.PrimaryButton
              className="btn-ls"
              onClick={() => handleStart()}
            >
              Start
            </globalComps.PrimaryButton>
          </styled.VendingMachineSFTMenuButtom>
        </styled.VendingMachineSFTMenuScreenContent>
      </styled.VendingMachineSFTMenuScreenComp>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
