import styled from "@emotion/styled";
import { mediaQuery } from "consts/media-queries.const";

export const LoveShackInterface = styled.div({
  "& .col-left": {
    textAlign: "left",
  },

  "& .col-right": {
    textAlign: "right",
  },
});

export const LoveShackInterfaceHeader = styled.div({
  background: "linear-gradient(180deg, #7e80d4 0%, #9963d4 100%)",
  boxShadow: "0px 3px 3px 2px rgba(0, 0, 0, 0.05)",
  padding: "10px",
  border: "1px",
  borderRadius: "12px",
  borderTopLeftRadius: "14px",
  minWidth: "100px",
  minHeight: "78px",
  textAlign: "left",

  display: "flex",
  justifyContent: "space-between",

  h3: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: 700,
  },

  ".header-title": {
    display: "flex",

    gap: "10px",

    "#header-title-logo": {
      width: "60px",
      textAlign: "center",
      img: {
        width: "auto",
        height: "58px",
        filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2))",
      },
    },

    "#header-title-content": {},
  },

  ".header-description": {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    width: "150px",

    "#egg-balance": {
      fontSize: "20px",
    },

    img: {
      height: "32px",
      width: "auto",
    },
  },

  [mediaQuery.mobileM]: {
    ".header-description": {
      display: "none",
    },
  },
});

export const LoveShackInterfaceBody = styled.div({
  "& .body-card": {
    padding: "22px 15px 0",
  },

  "& .body-card:nth-of-type(3)": {
    paddingTop: "28.5px",
    paddingBottom: "6px",
  },

  ".ant-progress-inner": {
    background: "hsla(0,0%,100%,.08)",
  },
});

export const LoveShackInterfaceURL = styled.a({
  color: "#63a8dd",
});
