import styled from "@emotion/styled";

export const PrimaryButton = styled.button({
  background: "#b73fcb",
  boxShadow: "0 3px 3px 2px rgb(0 0 0 / 10%)",
  borderRadius: "10px",
  width: "100%",
  fontWeight: 700,
  color: "hsla(0,0%,100%,.85)",
  border: "1px solid #434343",
  transition: "all .3s cubic-bezier(.645,.045,.355,1)",
  textAlign: "center",
  height: "32px",
  padding: "4px 15px",
  fontSize: "14px",
  cursor: "pointer",

  ":hover ": {
    color: "#b73fcb !important",
    borderColor: "#b73fcb !important",
    textDecoration: "none",
    background: "transparent",
  },

  ":focus": {
    color: "#b73fcb !important",
    borderColor: "#b73fcb !important",
    textDecoration: "none",
    background: "transparent",
  },
});
