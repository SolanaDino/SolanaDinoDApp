import React, { useCallback, useState } from "react";
import { Row, Col, Card, Modal } from "antd";
import "react-toastify/dist/ReactToastify.css";

import * as incubatorComps from "components/Incubator";

import * as styled from "./incubator.styles";

export const IncubatorView = () => {
  return (
    <>
      <styled.IncubatorWrapper>
        <styled.IncubatorContainer>
          <incubatorComps.VendingMachineComp />
        </styled.IncubatorContainer>
        <styled.IncubatorContainer>
          <incubatorComps.IncubatorTubeComp />
        </styled.IncubatorContainer>
      </styled.IncubatorWrapper>
    </>
  );
};
