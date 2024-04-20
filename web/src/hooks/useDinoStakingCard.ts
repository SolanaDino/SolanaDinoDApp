import * as utils from "utils";
import * as hooks from "hooks";
import * as models from "models";

export function useDinoStakingCard() {
  const { dinoLsAccts } = hooks.useDinoLsAccounts();
  const { stakingAccts } = hooks.useStakingAccounts();
  const dinoTokenBalances = hooks.useDinoTokenBalances();

  const balanceDino = dinoTokenBalances.dinoBalance;
  const balanceEgg = dinoTokenBalances.eggBalance;
  const rateDiv = 1;
  const rate = 2_500_000 * 100_000;

  const estimatedMintBEarn = stakingAccts?.stakeAcctNewInfo
    ? utils
        .setDecimal(
          utils.calculateEstimatedEarnEgg30(
            stakingAccts.stakeAcctNewInfo,
            rate,
            rateDiv,
            stakingAccts.stakeAcctNewInfo.dinoMintStaked
          ),
          6
        )
        .toFixed(6)
        .toString()
    : "-";

  const earnedMintBBalance = stakingAccts?.stakeAcctNewInfo
    ? utils
        .setDecimal(
          utils.calculateDinoEarnedEggConstant(
            stakingAccts.stakeAcctNewInfo,
            rate,
            rateDiv,
            stakingAccts.stakeAcctNewInfo.bMintEarnedFromDino,
            stakingAccts.stakeAcctNewInfo.dinoMintStaked
          ),
          6
        )
        .toFixed(6)
        .toString()
    : "-";

  //TODO dynamic!
  const currentEarningRate = "1 DINOEGG / 300k DINO / 30 days";

  const dinoStake = stakingAccts?.stakeAcctNewInfo?.dinoMintStaked
    ? stakingAccts.stakeAcctNewInfo.dinoMintStaked.toNumber() / 1000000
    : 0;

  var stakingCard = <models.StakingCard>{};

  stakingCard.unstakedMintABalance = balanceDino;
  stakingCard.stakedMintABalance = dinoStake;
  stakingCard.estimatedMintBStakeTime = "-";
  stakingCard.claimedMintBBalance = balanceEgg.toString();
  stakingCard.earnedMintBBalance = earnedMintBBalance;
  stakingCard.mintAPoolSize = utils.numberWithSpaces(
    dinoLsAccts?.stakePool.toFixed() ?? "0"
  );
  stakingCard.stakedMintAPercentage =
    (dinoStake / (dinoStake + balanceDino)) * 100;
  stakingCard.currentEarningRate = currentEarningRate;
  stakingCard.estimatedMintBEarn = estimatedMintBEarn;

  return stakingCard;
}
