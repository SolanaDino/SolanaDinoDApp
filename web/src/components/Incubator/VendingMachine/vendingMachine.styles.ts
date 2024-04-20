import styled from "@emotion/styled";
import * as mints from "consts/mints";
import { keyframes } from "@emotion/react";

export const VendingMachineComp = styled.div<{ bgImg: string }>(
  ({ bgImg }) => ({
    color: "rgba(255,255,255,0.85)",
    backgroundImage: `url(${bgImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    width: "513px", //113.40
    // margin: "-100px",
    height: "900px",
    margin: "10px auto",

    h3: {
      color: "rgba(255,255,255,0.85)",
    },
  })
);

export const VendingMachineWrapper = styled.div({
  display: "grid",
  gridTemplateColumns: "246px 71px",
  gridGap: "15px",
  padding: "176px 0 0 93px",
  height: "54%",
});

export const VendingMachineWarning = styled.div({
  position: "absolute",
  top: "20px",
  width: "100%",
  fontSize: "14px",
  lineHeight: "30px",
  fontWeight: "bold",
  height: "30px",
  background: "#b73fcb",
});

export const VendingMachineScreen = styled.div({
  position: "relative",
  height: "100%",
});

export const VendingMachineControls = styled.div({
  position: "relative",
  height: "100%",
});

export const VendingMachineVideo = styled.video({
  width: "100%",
  height: "100%",
  position: "relative",
  objectFit: "cover",
  zIndex: 0,
});

const glow = keyframes`
from {
  color: #efb1ff; 
  text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
}
to {
  color: #f1e6f1;
  text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
}
`;

export const VendingMachineDisplayText = styled.div({
  position: "absolute",
  top: "88px",
  width: "100%",
  textAlign: "center",
  color: "#fff",
  textTransform: "uppercase",

  WebkitAnimation: `${glow} 1s ease-in-out infinite alternate`,
  MozAnimation: `${glow} 1s ease-in-out infinite alternate`,
  animation: `${glow} 1s ease-in-out infinite alternate`,
});

export const VendingMachineLED = styled.div<{ isBusy: boolean }>(
  ({ isBusy }) => ({
    position: "absolute",
    top: "170px",
    left: "calc(50% - 5px)",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    // WebkitBoxShadow: "2px 0px 10px 4px #15a91d",

    //FE5BC1 red
    backgroundColor: isBusy ? "#FE5BC1" : "#9FFDFE",
  })
);

export const VendingMachineHomeButton = styled.div({
  position: "relative",
  textAlign: "center",
  width: "100%",
  margin: "15px 0",
});
