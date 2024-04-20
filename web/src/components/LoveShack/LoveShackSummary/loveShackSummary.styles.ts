import styled from "@emotion/styled";

import * as consts from "consts";

export const LoveShackSummary = styled.div({
  position: "relative",
  maxWidth: "600px",
});

export const LoveShackSummaryCard = styled.div({
  position: "relative",
  fontWeight: 400,
  fontSize: "14px",
  minHeight: "232px",

  background: "#32363d",
  borderRadius: "15px",
  boxShadow: "1px 4px 40px 3px rgb(0 0 0 / 15%)",
  boxSizing: "border-box",
  border: "1px solid #303030",

  margin: "0 0 0 auto",

  padding: "10px",
  color: "rgba(255, 255, 255, 0.85)",

  ".summary-header": {
    height: "40px",
    marginBottom: "8px",

    div: {
      background: "linear-gradient(180deg, #7e80d4 0%, #9963d4 100%)",
      boxShadow: "0px 3px 3px 2px rgba(0, 0, 0, 0.05)",
      borderRadius: "10px",

      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "40px",
      textAlign: "center",
      width: "175px",
    },
  },

  ".summary-body": {
    padding: "10px",
    textAlign: "left",
  },
});

export const LoveShackSummaryBar = styled.div({
  display: "flex",
  flexWrap: "wrap",
  marginTop: "27px",
  padding: "0 10px",
  justifyContent: "space-between",

  fontWeight: 400,
  fontSize: "14px",

  width: "100%",
  minHeight: "74px",

  background: "#32363d",
  borderRadius: "15px",
  boxShadow: "1px 4px 40px 3px rgb(0 0 0 / 15%)",
  boxSizing: "border-box",
  border: "1px solid #303030",
  color: "rgba(255, 255, 255, 0.85)",

  position: "relative",
});

export const SummaryBarContainer = styled.div({
  padding: "0 5px",
  textAlign: "left",
  margin: "auto 0",
  width: "50%",

  ".disabled": {
    color: "grey",
  },

  p: {
    marginBottom: "0px",
    fontSize: "14px",
  },

  span: {
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "28px",
    color: "#63a8dd",
  },
});

export const SummaryBarWrapper = styled.div({
  position: "relative",
  display: "flex",
  width: "50%",

  [consts.mediaQuery.mobileM]: {
    width: "100%",
    justifyContent: "space-around",
    margin: "10px 0",
  },
});
