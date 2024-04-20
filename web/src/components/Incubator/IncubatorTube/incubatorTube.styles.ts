import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

export const IncubatorTube = styled.div<{ bgImg: string }>(({ bgImg }) => ({
  backgroundImage: `url(${bgImg})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  width: "508px", //113.40
  // margin: "-100px",
  height: "900px",
  margin: "10px auto",
  position: "relative",
}));

const float = keyframes`
0% {
  transform: translatey(0px);
}
50% {
  transform: translatey(-20px);
}
100% {
  transform: translatey(0px);
}
`;

export const IncubatorHoveringEgg = styled.div({
  position: "absolute",
  animation: `${float} 6s ease-in-out infinite`,
  width: "280px",
  height: "auto",
  left: "calc(50% - 140px)",
  top: "320px",

  "& img": {
    filter: "contrast(.80) brightness(1.4)",
    width: "100%",
    height: "auto",
  },
});
