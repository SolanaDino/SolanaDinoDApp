import styled from "@emotion/styled";

export const Header = styled.header(() => ({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  zIndex: 10,
  padding: "0 30px",
  color: "rgba(255,255,255,0.85)",

  h2: {
    color: "rgba(255,255,255,0.85)",
  },

  ".app-title": {
    display: "flex",
    gap: "10px",

    img: {
      height: "45px",
    },
  },
}));

export const HeaderActions = styled.div({
  display: "flex",
  background: "#1a2029",
  margin: "auto 10px",
  borderRadius: "12px",
  fontSize: "16px",
  height: "45px",

  ".nav-label": {
    borderRadius: "12px",
    margin: "5px",
    cursor: "pointer",
    height: "35px",
    padding: "0 20px",

    a: {
      lineHeight: "35px",
      fontWeight: "500",
      fontSize: "18px",
      color: "rgba(255,255,255,0.65)",
    },

    ":hover": {
      backgroundColor: "#2abdd2",

      a: {
        color: "white",
      },
    },
  },
});

export const WalletSection = styled.div({
  display: "flex",
  margin: "auto 0",
  textAlign: "center",
  position: "relative",

  ".egg-view": {
    position: "relative",
    width: "120px",
    lineHeight: "20px",
    height: "40px",
    padding: "5px",
    borderRadius: "12px",
    borderBottomColor: "transparent",
    backgroundColor: "#32363D",
    fontSize: "16px",
    marginRight: "10px",
    marginLeft: "-40px",

    borderBottom: 0,
    color: "rgba(255, 255, 255, 0.65)",
    background: "#1a2029",
    zIndex: 20,
  },
});

export const MobileToggler = styled.div({
  position: "relative",
  zIndex: 20,
  svg: {
    cursor: "pointer",
    height: 20,
    width: 20,
  },
});

export const BurgerSection = styled.div({
  margin: "auto",
});
