import styled from "@emotion/styled";
import * as colors from "consts/colors";

export const VendingMachineNFTMenuScreenComp = styled.div({
  position: "relative",
  height: "100%",
});

export const VendingMachineNFTMenuScreenHeader = styled.div({
  background: colors.GRADIENT_DINO,
  margin: "10px",
  padding: "12px 13px",
  display: "inline-flex",
  flexFlow: "row",
  width: "calc(100% - 20px)",
  boxShadow: "0px 3px 3px 2px rgb(0 0 0 / 5%)",
  borderRadius: "10px",
});

export const VendingMachineNFTMenuScreenHeaderTitle = styled.div({
  borderBottom: "",
  fontSize: "18px",
  fontWeight: "bold",
  lineHeight: "16px",
  textAlign: "left",
  width: "50%",
});

export const VendingMachineNFTMenuScreenHeaderBalance = styled.div({
  lineHeight: "18px",
  textAlign: "right",
  width: "50%",
});

export const VendingMachineNFTMenuScreenContent = styled.div({
  padding: "0 18px",
});

export const VendingMachineNFTMenuScreenContentTitle = styled.div({
  position: "relative",
  textAlign: "left",

  h3: {
    fontSize: "16px",
    fontWeight: "bold",
  },
});

export const VendingMachineNFTMenuScreenContentLore = styled.div({
  position: "relative",
  textAlign: "left",
  marginBottom: "10px",

  span: {
    fontStyle: "italic",
  },
});

export const VendingMachineNFTMenuScreenContentDescription = styled.div({
  position: "relative",
  textAlign: "left",
  span: {},
});

export const VendingMachineNFTMenuEggs = styled.div({
  padding: "4px 0",
  position: "relative",
  margin: "auto",
  width: "100%",
  textAlign: "center",
});

export const VendingMachineNFTMenuScreenContentNote = styled.div({
  position: "relative",
  textAlign: "left",
  fontSize: "10px", 
  color: colors.GRAY,
  span: {
    color: colors.PINK,
  },
});

export const VendingMachineNFTMenuButtom = styled.div({
  position: "relative",
  textAlign: "center",
  margin: "13px 0 0 0",
  width: "100%",
  padding: "0 50px",
});

export const EggIcon = styled.img({
  width: "55px",
  height: "auto",
  margin: "0 -2px",
});
