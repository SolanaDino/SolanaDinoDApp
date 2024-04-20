import React, { FC } from "react";
import { useEffect, useState } from "react";
import * as styled from "./egg.styled";
import * as models from "models";

import * as _consts from "./eggAnimation.consts";

export interface IEggAnimationComp {
  timer: number;
  eggToHatch: models.IEggRarities;
  isReady: boolean;
}

export type ISeqLength = 0 | 1 | 2 | 3 | 4 | 5;

export const EggAnimationComp: FC<IEggAnimationComp> = ({
  timer,
  eggToHatch,
}) => {
  const [eggTimerCount, setEggTimerCount] = useState<number>(1);
  const [actualEggCount, setActualEggCount] = useState<ISeqLength>(0);
  const [clickCount, setClickCount] = useState<number>(1);

  useEffect(() => {
    if (timer % 3 === 0) {
      if (actualEggCount < 5) {
        setActualEggCount((actualEggCount + 1) as ISeqLength);
      }
    }
  }, [timer]);

  return (
    <div>
      <styled.imgWiggle2
        intensity={clickCount}
        src={_consts.EGG_RARITIES_MAP[eggToHatch][actualEggCount]}
        onClick={() => setClickCount(clickCount + 1)}
      ></styled.imgWiggle2>
    </div>
  );
};
