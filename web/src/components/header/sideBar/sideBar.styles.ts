import styled from "@emotion/styled";

export const SideBar = styled.div(() => ({
  position: "fixed",
  right: 0,
  top: 0,
  height: "100vh",
  paddingTop: "70px",
  width: "200px",
  zIndex: 15,

  background: "#1a2029",

  ".ant-menu.ant-menu-dark": {
    background: "none",
  },

  button: {
    margin: "25px",
    width: "150px",
  },
}));
