import * as utils from "utils";
import * as hooks from "hooks";
import * as models from "models";

export function useStepStakingCard() {
  const { stepLsAccts } = hooks.useStepLsAccounts();
  const { stakingAccts } = hooks.useStakingAccounts();
  const dinoTokenBalances = hooks.useDinoTokenBalances();

  const balanceDinoLp = dinoTokenBalances.dinoStepBalance;
  const balanceEgg = dinoTokenBalances.eggBalance;

  const rateDiv = 288 * 2;
  const rate = 2_500_000 * 100_000;

  const estimatedMintBEarn = "-";

  const earnedMintBBalance = stakingAccts?.stakeAcctNewInfo
    ? utils
        .setDecimal(
          utils.calculateDinoEarnedEggConstant(
            stakingAccts.stakeAcctNewInfo,
            rate,
            rateDiv,
            stakingAccts.stakeAcctNewInfo.bMintEarnedFromStepLp,
            stakingAccts.stakeAcctNewInfo.stepLpMintStaked
          ),
          6
        )
        .toFixed(6)
        .toString()
    : "-";

  //TODO dynamic!
  const currentEarningRate = "1 DINOEGG / 28 935mil DINO-LP / 30 days";

  const dinoLpStake = stakingAccts?.stakeAcctNewInfo?.stepLpMintStaked
    ? utils.setDecimal(
        stakingAccts.stakeAcctNewInfo.stepLpMintStaked.toNumber(),
        8
      )
    : 0;

  var stakingCard = <models.StakingCard>{};

  stakingCard.unstakedMintABalance = balanceDinoLp;

  stakingCard.stakedMintABalance = dinoLpStake;
  stakingCard.estimatedMintBStakeTime = "-";
  stakingCard.claimedMintBBalance = balanceEgg.toString();
  stakingCard.earnedMintBBalance = earnedMintBBalance;
  stakingCard.mintAPoolSize = utils.numberWithSpaces(
    stepLsAccts?.stakePool.toFixed() ?? "0"
  );
  stakingCard.stakedMintAPercentage =
    (dinoLpStake / (dinoLpStake + balanceDinoLp)) * 100;
  stakingCard.currentEarningRate = currentEarningRate;
  stakingCard.estimatedMintBEarn = estimatedMintBEarn;

  return stakingCard;
}
