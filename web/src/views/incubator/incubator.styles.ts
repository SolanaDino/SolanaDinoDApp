import styled from "@emotion/styled";

export const IncubatorWrapper = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  width: "100%",
  justifyContent: "center",
  alignItems: "center",

  "@media (max-width: 992px)": {
    gridTemplateColumns: "1fr",
  },
});
export const IncubatorContainer = styled.div({
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)",
  width: "auto",
});

// position:relative;
//         left: 50%;
//         transform: translateX(-50%);
//         width: auto;
