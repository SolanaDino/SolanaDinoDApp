import React, { FC } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";

import * as hooks from "hooks";
import * as models from "models";

import * as globalComps from "components/Global";

import * as styled from "./vendingMachineMintNFT.styles";
import * as _consts from "../../vendingMachine.const";

export interface IVendingMachineMintNFTComp
  extends models.IIncubatorVendingMachineViewProps {}

export const VendingMachineMintNFTComp: FC<IVendingMachineMintNFTComp> = ({
  onNext,
  onHatch,
  onMint,
}) => {
  const form = useForm<models.ISelectEggForm>({
    mode: "onChange",
    defaultValues: {
      egg: undefined,
    },
  });

  const balances = hooks.useEggNFTBalanceNew();

  const handleOnSubmit = (data: models.ISelectEggForm) => {
    onHatch && onHatch(data.egg);
  };

  return (
    <styled.VendingMachineMintNFTComp
      onSubmit={form.handleSubmit(handleOnSubmit)}
    >
      <styled.VendingMachineMintNFTHeader>
        <styled.VendingMachineMintNFTHeaderTitle>
          Select an egg to hatch
        </styled.VendingMachineMintNFTHeaderTitle>
      </styled.VendingMachineMintNFTHeader>
      <styled.VendingMachineMintNFTContent>
        <styled.VendingMachineMintNFTBoosterNFTLabel>
          SFT Balance
        </styled.VendingMachineMintNFTBoosterNFTLabel>
        <styled.VendingMachineNFTMenuEggs>
          {Object.entries(_consts.EGG_RARITIES_MAP).map(([key]) => {
            const eggRarity = key as models.IEggRarities;

            return (
              balances[eggRarity].balance !== 0 && (
                <styled.EggCard key={key}>
                  <input
                    {...form.register("egg", {
                      required: "You must select an egg.",
                    })}
                    type="radio"
                    value={key}
                    id={key}
                  />
                  <label htmlFor={key}>
                    <div className="egg-container">
                      <img src={_consts.EGG_RARITIES_MAP[eggRarity].eggAsset} />
                      <div className="egg-description">
                        <div>{_consts.EGG_RARITIES_MAP[eggRarity].name}</div>
                        <div>Balance: {balances[eggRarity].balance}</div>
                      </div>
                    </div>
                  </label>
                </styled.EggCard>
              )
            );
          })}
        </styled.VendingMachineNFTMenuEggs>
        <styled.VendingMachineMintNFTContentNote>
          <span>Mint fee: </span>0.10 sol
        </styled.VendingMachineMintNFTContentNote>
        <styled.VendingMachineMenuButtom>
          <globalComps.PrimaryButton className="btn-ls" type="submit">
            Hatch a Dino NFT!
          </globalComps.PrimaryButton>
        </styled.VendingMachineMenuButtom>
      </styled.VendingMachineMintNFTContent>
    </styled.VendingMachineMintNFTComp>
  );
};
