import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Col, Popover, Progress, Row } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import * as assets from "assets";
import * as models from "models";
import * as utils from "utils";

import * as consts from "./loveShackInterface.const";
import * as styled from "./loveShackInterface.styles";

export interface ILoveShackInterface {
  stakingType: models.IStakingTypes;
  stakingCard: models.StakingCard;
}

export const LoveShackInterfaceComp: FC<ILoveShackInterface> = ({
  stakingType,
  stakingCard,
}) => {
  const stakingContext = consts.DETAILS_STAKETYPE_MAP[stakingType];

  return (
    <styled.LoveShackInterface>
      <styled.LoveShackInterfaceHeader>
        <div className="header-title">
          <div id="header-title-logo">
            <img src={stakingContext.logo} alt="logo" />
          </div>

          <div id="header-title-content">
            <h3>{stakingContext.poolName}</h3>

            <div>
              Your stake:{" "}
              {utils.numberWithSpaces(
                stakingCard.stakedMintABalance?.toFixed(2) ?? "0"
              )}{" "}
              {stakingContext.tokenInitials}
            </div>
          </div>
        </div>

        <div className="header-description">
          <div>Research complete</div>

          <span id="egg-balance">
            <img src={assets.DINO_EGG_ICON} alt="Egg_logo" />{" "}
            {stakingCard.earnedMintBBalance ?? "-"}
          </span>
        </div>
      </styled.LoveShackInterfaceHeader>
      <styled.LoveShackInterfaceBody>
        <Row className="body-card" gutter={[0, 6]}>
          <Col className="col-left" xs={{ span: 14 }} lg={{ span: 14 }}>
            {stakingContext.link}
            <Popover content={stakingContext.linkPop} trigger="hover">
              <InfoCircleOutlined style={{ color: "#1890FF" }} />
            </Popover>
          </Col>
          <Col className="col-right" xs={{ span: 10 }} lg={{ span: 10 }}>
            <styled.LoveShackInterfaceURL
              target="_blank"
              href={stakingContext.linkUrl}
            >
              click here
            </styled.LoveShackInterfaceURL>
          </Col>
          <Col className="col-left" xs={{ span: 14 }} lg={{ span: 14 }}>
            Estimated DINOEGG earned per month:
          </Col>
          <Col className="col-right" xs={{ span: 10 }} lg={{ span: 10 }}>
            {stakingCard.estimatedMintBEarn}
          </Col>

          <Col className="col-left" xs={{ span: 12 }} lg={{ span: 12 }}>
            Wallet balance:
          </Col>
          <Col className="col-right" xs={{ span: 12 }} lg={{ span: 12 }}>
            {utils.numberWithSpaces(
              stakingCard.unstakedMintABalance?.toString() ?? "0"
            )}{" "}
            {stakingContext.tokenInitials}
          </Col>
          <Col span={24}>
            <Progress
              percent={stakingCard.stakedMintAPercentage}
              showInfo={false}
              status={"normal"}
              strokeColor={"#7792F0"}
            />
          </Col>
          <Col className="col-left" xs={{ span: 12 }} lg={{ span: 12 }}>
            Pool size:
          </Col>
          <Col className="col-right" xs={{ span: 12 }} lg={{ span: 12 }}>
            {stakingCard.mintAPoolSize} {stakingContext.tokenInitials}
          </Col>
        </Row>
      </styled.LoveShackInterfaceBody>
    </styled.LoveShackInterface>
  );
};
