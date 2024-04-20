import * as utils from "utils";
import * as hooks from "hooks";
import * as models from "models";

export function useTotalStakingCard() {
  var stakingCard = <models.SummaryCard>{};

  const stakingCardDataDino = hooks.useDinoStakingCard();
  const stakingCardDataRay = hooks.useRaydiumStakingCard();
  const stakingCardDataStep = hooks.useStepStakingCard();

  const { stakingAccts } = hooks.useStakingAccounts();

  stakingCard.unClaimedEgg = (
    (stakingCardDataDino.earnedMintBBalance === "-"
      ? 0
      : Number(stakingCardDataDino.earnedMintBBalance)) +
    (stakingCardDataRay.earnedMintBBalance === "-"
      ? 0
      : Number(stakingCardDataRay.earnedMintBBalance)) +
    (stakingCardDataStep.earnedMintBBalance === "-"
      ? 0
      : Number(stakingCardDataStep.earnedMintBBalance))
  ).toFixed(4);

  stakingCard.researchDaysLeft = utils.calculateResearchDaysLeft();

  stakingCard.triceratopsBonus = false; //checkTriceratopsBonus(stakingAccts?.stakeAcctNewInfo);

  stakingCard.calibrationBonus = utils.checkCalibrationBonus(
    stakingAccts?.stakeAcctNewInfo
  );

  return stakingCard;
}
