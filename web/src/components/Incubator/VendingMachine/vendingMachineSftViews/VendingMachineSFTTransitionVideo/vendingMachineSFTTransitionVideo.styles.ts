import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import * as colors from "consts/colors";

export const VendingMachineSFTTransitionVideoComp = styled.div({
  position: "relative",
  height: "100%",
  backgroundColor: "black",
});

export const glow = keyframes`
from {
  background-color: rgba(255, 255, 255, 0.01); 
}
to {
  background-color: rgba(255, 255, 255, 1); 
}
`;

export const VendingMachineSFTVideoFader = styled.div<{ isAnimated: boolean }>(
  ({ isAnimated }) => ({
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
    animation: isAnimated ? `${glow} 2s` : "none",
  })
);

export const VendingMachineSFTVideo = styled.video({
  width: "100%",
  height: "100%",
  position: "relative",
  objectFit: "cover",
  zIndex: 0,
});

export const VendingMachineSFTTransitionContainer = styled.div({
  position: "absolute",
  /* margin: auto; */
  bottom: "86px",
  width: "180px",
  left: "calc(50% - 90px)",

  "& button:hover": {
    background: colors.DARK_GRAY,
  },
});
