import { Button, Col, InputNumber, Row, Slider } from "antd";
import React, { FC, useState } from "react";
import "./style.less";
import { numberWithSpaces } from "utils";
import * as globalComps from "components/Global";

import * as styled from "./loveShackStake.styles";

export interface ILoveShackStakeProps {
  icon: string;
  isStake: boolean;
  onStake(value: number): any;
  onUnStake(value: number): any;
  unstakedMintABalance: number;
  stakedMintABalance: number;
  isSmallStep?: boolean;
}

export const LoveShackStake: FC<ILoveShackStakeProps> = ({
  icon,
  isStake,
  onStake,
  onUnStake,
  unstakedMintABalance,
  stakedMintABalance,
  isSmallStep = false,
}) => {
  const [inputValue, setInputValue] = useState<any>(0);

  const onChange = (value: number | any) => {
    setInputValue(value);
  };

  const setMaxInput = () => {
    setInputValue(
      isStake ? Number(unstakedMintABalance) : Number(stakedMintABalance)
    );
  };

  const clickStake = () => {
    onStake(inputValue);
  };

  const clickUnstake = () => {
    onUnStake(inputValue);
  };

  return (
    <styled.LoveShackStake>
      <Row className="stakeview-body">
        <Col className="col-left" span={12}>
          Currently staked: {numberWithSpaces(stakedMintABalance.toString())}
        </Col>
        <Col className="col-right" span={12}>
          Balance: {numberWithSpaces(unstakedMintABalance.toString())}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Slider
            min={0}
            max={
              isStake
                ? Number(unstakedMintABalance)
                : Number(stakedMintABalance)
            }
            step={isSmallStep ? 0.000001 : 1}
            onChange={onChange}
            value={typeof inputValue === "number" ? inputValue : 0}
          />
        </Col>
      </Row>
      <Row className="input-section" justify="space-around" align="middle">
        <Col className="col-left" span={12}>
          <InputNumber
            min={0}
            max={
              isStake
                ? Number(unstakedMintABalance)
                : Number(stakedMintABalance)
            }
            style={{ padding: "0" }}
            bordered={false}
            value={inputValue}
            onChange={onChange}
            className="input-number"
          />
        </Col>
        <Col className="col-right input-text" span={12}>
          <a onClick={() => setMaxInput()}>MAX</a>
          <span style={{ marginRight: "10px" }}>
            <img src={icon} className="dino-logo" alt="Dino_logo"></img>
            DINO
          </span>
        </Col>
      </Row>
      <Row justify="center" align="middle" className="btn-section">
        <Col span={10}>
          {isStake ? (
            <globalComps.PrimaryButton
              className="btn-ls"
              onClick={() => clickStake()}
            >
              Stake
              {/* //d */}
            </globalComps.PrimaryButton>
          ) : (
            <globalComps.PrimaryButton
              className="btn-ls"
              onClick={() => clickUnstake()}
            >
              Unstake
            </globalComps.PrimaryButton>
          )}
        </Col>
      </Row>
    </styled.LoveShackStake>
  );
};
