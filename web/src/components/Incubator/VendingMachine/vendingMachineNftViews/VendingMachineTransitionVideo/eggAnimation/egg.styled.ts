import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const wiggle = (intensity: number) => keyframes`
0 %  { transform: translate(1px, 1px)   rotate(0deg)    },
10%  { transform: translate(-1px, -2px) rotate(-${intensity}deg);  },
20%  { transform: translate(-3px, 0px)  rotate(${intensity}deg);   },
30%  { transform: translate(3px, 2px)   rotate(0deg);   },
40%  { transform: translate(1px, -1px)  rotate(${intensity}deg);   },
50%  { transform: translate(-1px, 2px)  rotate(-${intensity}deg);  },
60%  { transform: translate(-3px, 1px)  rotate(0deg);   },
70%  { transform: translate(3px, 1px)   rotate(-${intensity}deg);  },
80%  { transform: translate(-1px, -1px) rotate(${intensity}deg);   },
90%  { transform: translate(1px, 2px)   rotate(0deg);   },
100% { transform: translate(1px, -2px)  rotate(-${intensity}deg);  }
`;

export const imgWiggle2 = styled.img<{ intensity: number }>(
  ({ intensity }) => ({
    animation: `${wiggle(intensity)} 2s infinite ease`,
    cursor: "pointer",
    height: "250px",
    width: "auto",
  })
);
