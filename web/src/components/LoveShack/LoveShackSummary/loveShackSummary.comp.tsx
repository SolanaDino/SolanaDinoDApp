import React, { FC } from "react";
import { Button, Popover } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import * as hooks from "hooks";
import * as assets from "assets";

import * as globalComps from "components/Global";

import * as styled from "./loveShackSummary.styles";

export interface ILoveShackSummaryComp {
  onClaimStake(): void;
}

export const LoveShackSummaryComp: FC<ILoveShackSummaryComp> = ({
  onClaimStake,
}) => {
  const stakingCardData = hooks.useTotalStakingCard();

  const bonusText = (
    <div>
      <p>
        The scientists at the Love Shack research station are top-notch, but
        it's hard doing research in the jungle. <br />
        The lab equipment they use is constantly needing calibration, and there
        aren't enough lab technicians willing <br />
        to work in a rainforest! If you can keep the equipment calibrated, the
        researchers will be able to produce 10% <br />
        more DINOEGG using the material you bring them. <br />
      </p>
      <p>
        <b>
          Warning: Make sure to claim every 24 hours to keep the equipment
          calibrated and be rewarded with a 10% bonus!
        </b>
      </p>
    </div>
  );

  return (
    <styled.LoveShackSummary>
      <styled.LoveShackSummaryCard>
        <div className="summary-header">
          <div>Research Overview</div>
        </div>

        <div className="summary-body">
          <div>
            Welcome to The Love Shack! We are proud to operate the only state of
            the art research center located in the heart of a jungle! The work
            we do here is paramount to the return of the dinosaurs, so please
            deposit the DNA you've collected from DINO and LP tokens. Good
            research takes time, so check back frequently and see how our
            scientists are progressing on re-constructing your DINOEGG!
          </div>
        </div>
      </styled.LoveShackSummaryCard>
      <styled.LoveShackSummaryBar>
        <styled.SummaryBarWrapper>
          <styled.SummaryBarContainer>
            <p>Triceratops bonus </p>
            <span className="disabled">
              {stakingCardData.triceratopsBonus ? "Active" : "Inactive"}{" "}
              <Popover content={`Coming soon!`} trigger="hover">
                <InfoCircleOutlined className="disabled" />
              </Popover>
            </span>
          </styled.SummaryBarContainer>
          <styled.SummaryBarContainer>
            <p>Calibration bonus</p>
            <span>
              {stakingCardData.calibrationBonus ? "Active" : "Inactive"}{" "}
              <Popover content={bonusText} trigger="hover">
                <InfoCircleOutlined style={{ color: "#1890FF" }} />
              </Popover>
            </span>
          </styled.SummaryBarContainer>
        </styled.SummaryBarWrapper>
        <styled.SummaryBarWrapper>
          <styled.SummaryBarContainer>
            <p>Pending rewards</p>
            <span>
              <img
                src={assets.DINO_EGG_ICON}
                className="egg-logo-sm"
                alt="Egg_logo"
              ></img>{" "}
              {stakingCardData.unClaimedEgg}
            </span>
          </styled.SummaryBarContainer>
          <styled.SummaryBarContainer>
            <globalComps.PrimaryButton
              className="btn-ls btn-claim"
              onClick={() => {
                onClaimStake();
              }}
            >
              Claim
            </globalComps.PrimaryButton>
          </styled.SummaryBarContainer>
        </styled.SummaryBarWrapper>
      </styled.LoveShackSummaryBar>
    </styled.LoveShackSummary>
  );
};
