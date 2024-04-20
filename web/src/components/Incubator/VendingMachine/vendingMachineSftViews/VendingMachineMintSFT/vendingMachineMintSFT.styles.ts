import styled from "@emotion/styled";
import * as colors from "consts/colors";

export const VendingMachineMintSFTComp = styled.div({
  position: "relative",
  height: "100%",
});

export const VendingMachineMintSFTHeader = styled.div({
  background: colors.GRADIENT_DINO,
  margin: "10px",
  padding: "12px 13px",
  display: "inline-flex",
  flexFlow: "row",
  width: "calc(100% - 20px)",
  boxShadow: "0px 3px 3px 2px rgb(0 0 0 / 5%)",
  borderRadius: "10px",
});

export const VendingMachineMintSFTHeaderTitle = styled.div({
  borderBottom: "",
  fontSize: "13px",
  fontWeight: "bold",
  lineHeight: "18px",
  textAlign: "left",
  width: "55%",
});

export const VendingMachineMintSFTHeaderBalance = styled.div({
  lineHeight: "18px",
  fontSize: "13px",
  textAlign: "right",
  width: "45%",
});

export const VendingMachineMintSFTContent = styled.div({
  margin: "16px 0",
  padding: "0 18px",
});

export const VendingMachineMintSFTMintEgg = styled.div({
  background: "#4242534d",
  borderRadius: "10px",
  height: "50px",
  lineHeight: "50px",

  img: {
    width: "20px",
    height: "auto",
    marginRight: "5px",
  },
});

export const VendingMachineMintSFTPlus = styled.div({
  margin: "12px",
  height: "45px",
  "& span": {
    lineHeight: "40px",
    fontSize: "22px",
    fontWeight: "bold",
  },
});

export const VendingMachineMintSFTBoosterEgg = styled.div({
  display: "inline-flex",
  flexFlow: "row",
  width: "100%",
  background: "#4242534d",
  borderRadius: "10px",
  height: "50px",
  lineHeight: "50px",
});

export const VendingMachineMintSFTBoosterEggLabel = styled.div({
  position: "absolute",
  marginTop: "-10px",
  padding: "5px 8px",
  borderRadius: "7px",
  background: colors.GRADIENT_DINO,
  height: "20px",
  fontSize: "12px",
  lineHeight: "10px",
  "& span": {
    fontSize: "10px",
    color: colors.WHITE_GRAY,
  },
});

export const VendingMachineMintSFTInputWrapper = styled.div({
  width: "40%",

  input: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.85) !important",
  },
});

export const VendingMachineMintSFTAmountWrapper = styled.div({
  width: "60%",
  img: {
    width: "20px",
    height: "auto",
    marginRight: "5px",
  },
});

export const VendingMachineMintSFTContentNote = styled.div({
  position: "relative",
  textAlign: "left",
  fontSize: "10px",
  margin: "20px 0 ",
  color: colors.GRAY,
  span: {
    color: colors.PINK,
  },
});

export const VendingMachineMenuButtom = styled.div({
  position: "relative",
  textAlign: "center",
  margin: "8px 0 0 0",
  width: "100%",
  padding: "0 40px",
});

export const EggIcon = styled.img({
  width: "55px",
  height: "auto",
  margin: "0 -2px",
});
