import React, { FC, useState } from "react";

import * as styled from "./incubatorClaimModal.styles";

export interface IIncubatorClaimModalComp {
  onClaim(): any;
}

export const IncubatorClaimModalComp: FC<IIncubatorClaimModalComp> = ({
  onClaim,
}) => {
  const [inputValue, setInputValue] = useState<any>(0);

  const onChange = (value: number | any) => {
    setInputValue(value);
  };

  return (
    <styled.IncubatorClaimModal>
      <styled.IncubatorClaimWrapper>
        <styled.IncubatorClaimContainer>
          <h2>You got an unredeemed egg NFT!</h2>
          <h3>Press the button below to redeem.</h3>
        </styled.IncubatorClaimContainer>

        <styled.IncubatorClaimContainer>
          <button>Redeem</button>
        </styled.IncubatorClaimContainer>
      </styled.IncubatorClaimWrapper>
    </styled.IncubatorClaimModal>
  );
};
