import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, Slider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { messageToast } from "utils/toast";
import * as eggs from "assets/eggs";
import * as hooks from "hooks";
import * as models from "models";

import * as globalComps from "components/Global";

import * as styled from "./vendingMachineMenuNftScreen.styles";
import { ToastContainer } from "react-toastify";

export interface IVendingMachineMenuNftScreenInterface
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineNftMenuScreenComp: FC<
  IVendingMachineMenuNftScreenInterface
> = ({ onNext }) => {
  const { balanceEgg } = hooks.useEggBalance();
  const { balanceNFT1, balanceNFT2, balanceNFT3, balanceNFT4 } =
    hooks.useEggNFTBalance();
  const { incubatorProgram } = hooks.useIncubatorProgram();

  const { publicKey, signTransaction } = useWallet();
  const [inputValue, setInputValue] = useState<number>(1);

  const handleStart = () => {
    if (!publicKey || !incubatorProgram) {
      messageToast("error", "Wallet not connected.");
    } else if (
      balanceNFT1 == 0 &&
      balanceNFT2 == 0 &&
      balanceNFT3 == 0 &&
      balanceNFT4 == 0
    ) {
      messageToast("info", "You need minimum 1 EGG to hatch a Dino NFT.");
      // toaster
    } else {
      onNext && onNext();
    }
  };

  const onChange = (value: number) => {
    setInputValue(value);
  };

  return (
    <>
      <styled.VendingMachineNFTMenuScreenComp>
        <styled.VendingMachineNFTMenuScreenHeader>
          <styled.VendingMachineNFTMenuScreenHeaderTitle>
            Hatching
          </styled.VendingMachineNFTMenuScreenHeaderTitle>
        </styled.VendingMachineNFTMenuScreenHeader>
        <styled.VendingMachineNFTMenuScreenContent>
          <styled.VendingMachineNFTMenuScreenContentTitle>
            <h3>Welcome to the Incubator!</h3>
          </styled.VendingMachineNFTMenuScreenContentTitle>
          <styled.VendingMachineNFTMenuScreenContentLore>
            <span>
              Now that we have custructed some eggs, it's time to hatch them and
              resurrect the dinosaurs!
            </span>
          </styled.VendingMachineNFTMenuScreenContentLore>
          <styled.VendingMachineNFTMenuScreenContentDescription>
            <span>
              To intiate the hatching procedure you need at least one egg.
            </span>
          </styled.VendingMachineNFTMenuScreenContentDescription>

          <styled.VendingMachineNFTMenuEggs>
            <styled.EggIcon src={eggs.BLUE_DINO_EGG} /> {balanceNFT1}
            <styled.EggIcon src={eggs.GREEN_DINO_EGG} /> {balanceNFT2}
            <styled.EggIcon src={eggs.PURPLE_DINO_EGG} /> {balanceNFT3}
          </styled.VendingMachineNFTMenuEggs>
          <styled.VendingMachineNFTMenuScreenContentNote>
            <span>Important: </span>Do not click away during hatching!
          </styled.VendingMachineNFTMenuScreenContentNote>
          <styled.VendingMachineNFTMenuButtom>
            <globalComps.PrimaryButton
              className="btn-ls"
              onClick={() => handleStart()}
            >
              Start
            </globalComps.PrimaryButton>
          </styled.VendingMachineNFTMenuButtom>
        </styled.VendingMachineNFTMenuScreenContent>
      </styled.VendingMachineNFTMenuScreenComp>
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
