import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const glow = keyframes`
from {
  filter: brightness(10);
}
to {
  filter: brightness(1);
}
`;

export const VendingMachineNFTTransitionVideoComp = styled.div({
  position: "relative",
  height: "100%",
});

export const VendingMachineNFTVideo = styled.div({
  width: "100%",
  borderRadius: "5px",
  position: "relative",
  objectFit: "cover",
  zIndex: 0,
  cursor: "pointer",
  textAlign: "center",
  boxShadow: "0px 0px 40px 20px #99ccff",
  animation: `${glow} 4s`,
  // boxShadow: "inset 60px 0 120px #f0f, inset -60px 0 120px #0ff",
  // boxShadow:
  //   "0 0 40px 20px #fff, 0 0 50px 30px  #99ccff, 0 0 60px 40px  #99ccff",

  img: {
    margin: " 0",
    borderRadius: "5px",
    width: "100%",
  },
});

export const VendingMachineNFTFinishedText = styled.div<{ color: string }>(
  ({ color }) => ({
    position: "absolute",
    fontSize: "18px",
    textAlign: "center",
    margin: "auto",
    top: "90%",
    width: "100%",

    fontWeight: "bold",
    cursor: "pointer",
    div: {
      width: "90%",
      margin: "auto",
    },
    "& span": {
      color: color,
    },
  })
);

export const VendingMachineNFTFinishedSubText = styled.div({
  fontSize: "9px",
  color: "lightgray",
  textAlign: "center",
  margin: "auto",
  position: "absolute",
  top: "110%",
  width: "100%",
  cursor: "pointer",
});
