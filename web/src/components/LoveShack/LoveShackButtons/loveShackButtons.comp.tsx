import { Button, Col, Row } from "antd";
import React, { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import * as models from "models";
import * as hooks from "hooks";

import * as globalComps from "components/Global";

import * as consts from "./loveShackButtons.const";
import * as styled from "./loveShackButtons.styles";

export interface ILoveShackButtons {
  stakingType: models.IStakingTypes;
  onOpenStakeModal(): any;
  onOpenUnStakeModal(): any;
  onInitLsInstructions(): any;
}

export const LoveShackButtons: FC<ILoveShackButtons> = ({
  stakingType,
  onOpenStakeModal,
  onOpenUnStakeModal,
  onInitLsInstructions,
}) => {
  const { connected } = useWallet();

  return (
    <>
      <Col span={8}></Col>
      {connected ? (
        <Row className="btn-section" justify="space-around" align="middle">
          {stakingType !== "STEP" && (
            <Col span={11}>
              <globalComps.PrimaryButton
                className="btn-ls"
                onClick={() => onOpenStakeModal()}
              >
                Stake
              </globalComps.PrimaryButton>
            </Col>
          )}
          <Col span={11}>
            <globalComps.PrimaryButton
              className="btn-ls"
              onClick={() => onOpenUnStakeModal()}
            >
              Unstake
            </globalComps.PrimaryButton>
          </Col>
        </Row>
      ) : (
        <Row justify="space-around" align="middle" className="btn-section">
          <styled.WalletNotConnected>
            <Col span={24}>Wallet not connected</Col>
          </styled.WalletNotConnected>
        </Row>
      )}
    </>
  );
};
