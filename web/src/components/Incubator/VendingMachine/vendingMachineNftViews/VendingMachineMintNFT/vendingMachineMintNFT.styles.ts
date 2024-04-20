import styled from "@emotion/styled";
import * as colors from "consts/colors";

export const VendingMachineMintNFTComp = styled.form({
  position: "relative",
  height: "100%",
});

export const VendingMachineMintNFTHeader = styled.div({
  background: colors.GRADIENT_DINO,
  margin: "10px 10px 5px",
  padding: "12px 13px",
  display: "inline-flex",
  flexFlow: "row",
  width: "calc(100% - 20px)",
  boxShadow: "0px 3px 3px 2px rgb(0 0 0 / 5%)",
  borderRadius: "10px",
});

export const VendingMachineMintNFTHeaderTitle = styled.div({
  fontSize: "18px",
  fontWeight: "bold",
  lineHeight: "16px",
  textAlign: "center",
  width: "100%",
});

export const VendingMachineMintNFTContent = styled.div({
  position: "relative",
  height: "210px",
  padding: "0 18px",
});

export const VendingMachineMintNFTMintNFT = styled.div({
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

export const VendingMachineMintNFTBoosterNFTLabel = styled.div({
  position: "relative",
  padding: "5px 8px",
  margin: "10px 0 ",
  borderRadius: "7px",
  background: colors.GRADIENT_DINO,
  height: "20px",
  fontSize: "12px",
  lineHeight: "10px",
  "& span": {
    fontSize: "10px",
    color: colors.WHITE_GRAY,
  },
  width: "80px",
});

export const VendingMachineMintNFTContentNote = styled.div({
  position: "relative",
  textAlign: "left",
  alignContent: "left",
  fontSize: "10px",
  margin: "5px 0 ",
  color: colors.GRAY,
  fontWeight: 600,
  span: {
    color: colors.PINK,
  },
});

export const VendingMachineMenuButtom = styled.div({
  position: "relative",
  textAlign: "center",
  width: "100%",
  padding: "0 10px",
});

export const EggIcon = styled.img({
  width: "55px",
  height: "auto",
});

export const VendingMachineNFTMenuEggs = styled.div({
  display: "flex",
  gap: "10px",
  flexDirection: "column",
  padding: "2px 0",
  position: "relative",
  margin: "auto",
  width: "100%",
  textAlign: "center",
  // height: "250px",
  // overflow: "scroll",
});

export const EggCard = styled.div({
  display: "flex",
  position: "relative",
  background: "#373A44",
  borderRadius: "7px",
  height: "70px",

  "input[type=radio]": {
    display: "none",
    "&:checked + label": {
      border: "2px solid #7792F0",
      borderRadius: "7px",
    },
  },
  label: {
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    cursor: "pointer",

    ".egg-container": {
      display: "flex",
      height: "100%",
      alignItems: "center",
    },

    ".egg-description": {
      display: "flex",
      position: "relative",

      textAlign: "left",
      margin: "10px 0",
      fontsize: "12px",
      flexFlow: "column",
    },
  },

  img: {
    width: "auto",
    height: "70px",
  },
});

export const ShowEggContainer = styled.div({
  display: "flex",
  position: "relative",

  textAlign: "left",
  margin: "10px 0",
  fontsize: "12px",
  flexFlow: "column",
});
