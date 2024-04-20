import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button, InputNumber, Slider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import * as eggs from "assets/eggs";
import * as icons from "assets/icons";
import * as hooks from "hooks";
import * as models from "models";

import * as globalComps from "components/Global";

import * as styled from "./vendingMachineMintSFT.styles";
import * as utils from "utils/incubator.utils";

export interface IVendingMachineMinTSFTComp
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineMintSFTComp: FC<IVendingMachineMinTSFTComp> = ({
  onNext,
  onMint,
}) => {
  const { balanceEgg } = hooks.useEggBalance();
  const [inputValue, setInputValue] = useState<number>(0);

  const onChange = (value: number) => {
    setInputValue(value);
  };

  const onMintClicked = () => {
    onMint && onMint(inputValue);
  };

  return (
    <styled.VendingMachineMintSFTComp>
      <styled.VendingMachineMintSFTHeader>
        <styled.VendingMachineMintSFTHeaderTitle>
          Add EGG tokens
        </styled.VendingMachineMintSFTHeaderTitle>
        <styled.VendingMachineMintSFTHeaderBalance>
          Balance: {Math.round(balanceEgg * 100) / 100}
        </styled.VendingMachineMintSFTHeaderBalance>
      </styled.VendingMachineMintSFTHeader>
      <styled.VendingMachineMintSFTContent>
        <styled.VendingMachineMintSFTMintEgg>
          <span>
            1 DINOEGG
            <img src={icons.DINO_EGG_ICON} alt="egg_logo" />
          </span>
        </styled.VendingMachineMintSFTMintEgg>
        <styled.VendingMachineMintSFTPlus>
          <span>+</span>
        </styled.VendingMachineMintSFTPlus>
        <styled.VendingMachineMintSFTBoosterEgg>
          <styled.VendingMachineMintSFTBoosterEggLabel>
            Booster eggs <span>(optional)</span>
          </styled.VendingMachineMintSFTBoosterEggLabel>
          <styled.VendingMachineMintSFTInputWrapper>
            <InputNumber
              min={0}
              max={
                balanceEgg - 1 < 0 ? 0 : balanceEgg - 1 > 3 ? 3 : balanceEgg - 1
              }
              step={0.01}
              style={{ padding: "0" }}
              bordered={false}
              value={inputValue}
              onChange={onChange}
            />
          </styled.VendingMachineMintSFTInputWrapper>
          <styled.VendingMachineMintSFTAmountWrapper>
            <span>
              DINOEGG
              <img src={icons.DINO_EGG_ICON} alt="egg_logo" />
            </span>
          </styled.VendingMachineMintSFTAmountWrapper>
        </styled.VendingMachineMintSFTBoosterEgg>
        <styled.VendingMachineMintSFTContentNote>
          <span>Important: </span>Adding booster eggs will increase the chance
          of minting a rare egg NFT.
        </styled.VendingMachineMintSFTContentNote>
        <styled.VendingMachineMenuButtom>
          <globalComps.PrimaryButton
            className="btn-ls"
            onClick={() => onMintClicked()}
          >
            Mint Egg NFT
          </globalComps.PrimaryButton>
        </styled.VendingMachineMenuButtom>
      </styled.VendingMachineMintSFTContent>
    </styled.VendingMachineMintSFTComp>
  );
};
