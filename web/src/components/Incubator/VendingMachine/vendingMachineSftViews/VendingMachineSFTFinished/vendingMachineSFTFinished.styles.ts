import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

export const VendingMachineSFTTransitionVideoComp = styled.div({
  position: "relative",
  height: "100%",
  cursor: "pointer",
});

export const VendingMachineSFTVideo = styled.video({
  width: "100%",
  borderRadius: "5px",
  position: "relative",
  objectFit: "cover",
  zIndex: 0,
});

export const VendingMachineSFTFinishedText = styled.div<{ color: string }>(
  ({ color }) => ({
    position: "absolute",
    fontSize: "18px",
    textAlign: "center",
    margin: "auto",
    top: "75%",
    width: "100%",
    fontWeight: "bold",
    "& span": {
      color: color,
    },
  })
);

export const VendingMachineSFTFinishedSubText = styled.div({
  fontSize: "9px",
  color: "lightgray",
  textAlign: "center",
  margin: "auto",
  position: "absolute",
  top: "83%",
  width: "100%",
});
