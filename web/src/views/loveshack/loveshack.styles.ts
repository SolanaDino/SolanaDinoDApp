import styled from "@emotion/styled";
import * as consts from "consts";

export const LoveshackView = styled.div({
  [consts.mediaQuery.mobileL]: {
    margin: "0 15px",
  },
});

export const LoveShackCard = styled.div({
  fontWeight: 400,
  fontSize: "14px",
  maxWidth: "600px",
  background: "#32363d",
  borderRadius: "15px",
  boxShadow: "1px 4px 40px 3px rgb(0 0 0 / 15%)",

  color: "rgba(255,255,255,0.85)",
  padding: "10px",
});

export const LoveShackInterfaceWrapper = styled.div({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  justifyItems: "center",
  gap: 48,
  flexWrap: "wrap",
  marginBottom: 48,
});
