import * as utils from "utils";
import * as hooks from "hooks";
import * as models from "models";

export function useRaydiumStakingCard() {
  const { raydiumLsAccts } = hooks.useRaydiumLsAccounts();
  const { stakingAccts } = hooks.useStakingAccounts();
  const dinoTokenBalances = hooks.useDinoTokenBalances();

  const balanceDinoLp = dinoTokenBalances.dinoRayBalance;
  const balanceEgg = dinoTokenBalances.eggBalance;

  const rateDiv = 22_040 * 2;
  const rate = 2_500_000 * 100_000 * 100_000;

  const estimatedMintBEarn = stakingAccts?.stakeAcctNewInfo
    ? utils
        .setDecimal(
          utils.calculateEstimatedEarnEgg30(
            stakingAccts.stakeAcctNewInfo,
            rate,
            rateDiv,
            stakingAccts.stakeAcctNewInfo.raydiumLpMintStaked
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
            stakingAccts.stakeAcctNewInfo.bMintEarnedFromRaydiumLp,
            stakingAccts.stakeAcctNewInfo.raydiumLpMintStaked
          ),
          6
        )
        .toFixed(6)
        .toString()
    : "-";

  //TODO dynamic!
  const currentEarningRate = "1 DINOEGG / 174mil DINO-LP / 30 days";

  const dinoLpStake = stakingAccts?.stakeAcctNewInfo?.raydiumLpMintStaked
    ? utils.setDecimal(
        stakingAccts.stakeAcctNewInfo.raydiumLpMintStaked.toNumber(),
        6
      )
    : 0;

  var stakingCard = <models.StakingCard>{};

  stakingCard.unstakedMintABalance = balanceDinoLp;
  stakingCard.stakedMintABalance = dinoLpStake;
  stakingCard.estimatedMintBStakeTime = "-";
  stakingCard.claimedMintBBalance = balanceEgg.toString();
  stakingCard.earnedMintBBalance = earnedMintBBalance;
  stakingCard.mintAPoolSize = utils.numberWithSpaces(
    raydiumLsAccts?.stakePool.toFixed() ?? "0"
  );
  stakingCard.stakedMintAPercentage =
    (dinoLpStake / (dinoLpStake + balanceDinoLp)) * 100;

  stakingCard.currentEarningRate = currentEarningRate;
  stakingCard.estimatedMintBEarn = estimatedMintBEarn;

  return stakingCard;
}
