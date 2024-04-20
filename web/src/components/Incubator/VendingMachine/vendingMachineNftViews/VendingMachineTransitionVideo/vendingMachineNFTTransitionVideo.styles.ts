import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import * as colors from "consts/colors";

export const VendingMachineNFTTransitionVideoComp = styled.div({
  position: "relative",
  alignContent: "center",
  verticalAlign: "center",
  height: "100%",
  backgroundColor: colors.GRADIENT_DINO,
});

export const glow = keyframes`
from {
  background-color: rgba(255, 255, 255, 0.01); 
}
to {
  background-color: rgba(255, 255, 255, 1); 
}
`;

export const VendingMachineNFTVideoEggComp = styled.div({
  margin: "25px 0",
  position: "relative",
  alignContent: "center",
  verticalAlign: "center",
  height: "100%",
  backgroundColor: colors.GRADIENT_DINO,

  textAlign: "center",

  button: {
    width: "90%",
    // margin: "5px 15px",
  },
});

export const VendingMachineMintNFTHeaderTitle = styled.div({
  borderBottom: "",
  fontSize: "18px",
  fontWeight: "bold",
  lineHeight: "16px",
  textAlign: "center",
  width: "100%",
});

export const VendingMachineMintNFTHeader = styled.div({
  background: colors.GRADIENT_DINO,
  margin: "10px",
  padding: "12px 13px",
  display: "inline-flex",
  flexFlow: "row",
  width: "calc(100% - 20px)",
  boxShadow: "0px 3px 3px 2px rgb(0 0 0 / 5%)",
  borderRadius: "10px",
});
