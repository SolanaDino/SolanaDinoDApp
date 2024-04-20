import { useCallback, useState } from "react";

import * as models from "models";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { WAD, ZERO } from "../consts";
import { TokenInfo } from "@solana/spl-token-registry";

export type KnownTokenMap = Map<string, TokenInfo>;

export const formatPriceNumber = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

// shorten the checksummed version of the input address to have 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getTokenName(
  map: KnownTokenMap,
  mint?: string | PublicKey,
  shorten = true
): string {
  const mintAddress = typeof mint === "string" ? mint : mint?.toBase58();

  if (!mintAddress) {
    return "N/A";
  }

  const knownSymbol = map.get(mintAddress)?.symbol;
  if (knownSymbol) {
    return knownSymbol;
  }

  return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
}

export function getTokenByName(tokenMap: KnownTokenMap, name: string) {
  let token: TokenInfo | null = null;
  for (const val of tokenMap.values()) {
    if (val.symbol === name) {
      token = val;
      break;
    }
  }
  return token;
}

export function getTokenIcon(
  map: KnownTokenMap,
  mintAddress?: string | PublicKey
): string | undefined {
  const address =
    typeof mintAddress === "string" ? mintAddress : mintAddress?.toBase58();
  if (!address) {
    return;
  }

  return map.get(address)?.logoURI;
}

export function isKnownMint(map: KnownTokenMap, mintAddress: string) {
  return !!map.get(mintAddress);
}

export const STABLE_COINS = new Set(["USDC", "wUSDC", "USDT"]);

export function chunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(
    0,
    new Array(Math.ceil(array.length / size))
  ).map((_, index) => array.slice(index * size, (index + 1) * size));
}

export function wadToLamports(amount?: BN): BN {
  return amount?.div(WAD) || ZERO;
}
var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

const abbreviateNumber = (number: number, precision: number) => {
  let tier = (Math.log10(number) / 3) | 0;
  let scaled = number;
  let suffix = SI_SYMBOL[tier];
  if (tier !== 0) {
    let scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }

  return scaled.toFixed(precision) + suffix;
};

export const formatAmount = (
  val: number,
  precision: number = 6,
  abbr: boolean = true
) => (abbr ? abbreviateNumber(val, precision) : val.toFixed(precision));

export const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const isSmallNumber = (val: number) => {
  return val < 0.001 && val > 0;
};

export const formatNumber = {
  format: (val?: number, useSmall?: boolean) => {
    if (!val) {
      return "--";
    }
    if (useSmall && isSmallNumber(val)) {
      return 0.001;
    }

    return numberFormatter.format(val);
  },
};

export const feeFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 9,
});

export const formatPct = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function calculateDinoEarnedEggConstant(
  stakingAcctInfo: any,
  rate: number,
  rateDiv: number,
  bMintEarned: any,
  aMintStaked: any
): number {
  var TIME_NOW = Math.round(Date.now() / 1000);
  const CONST_RATE = rate * Math.pow(3, 1);

  const elapsedStakingTime =
    TIME_NOW - stakingAcctInfo.currentStakeUnixTimestamp.toNumber();
  const alreadyEarnedEgg = bMintEarned ? bMintEarned.toNumber() : 0; // Already earned Egg

  var curEarningEgg = 0;

  curEarningEgg += (aMintStaked * elapsedStakingTime * rateDiv) / CONST_RATE; // Calculate remaing egg

  if (0 > alreadyEarnedEgg + curEarningEgg) {
    return 0;
  }

  return alreadyEarnedEgg + curEarningEgg;
}

export function calculateDinoEarnedEgg(
  stakingAcctInfo: any,
  rate: number,
  rateDiv: number,
  bMintEarned: any,
  aMintStaked: any
): number {
  const DINO_EGG_BEGIN = 1626912000;
  var TIME_NOW = Math.round(Date.now() / 1000);
  const DINO_EGG_THIRD = 66 * 24 * 60 * 60;
  const INIT_RATE = rate * Math.pow(3, 0);

  const alreadyEarnedEgg = bMintEarned ? bMintEarned.toNumber() : 0; // Already earned Egg

  const eggTimeStartStake =
    stakingAcctInfo.currentStakeUnixTimestamp.toNumber() - DINO_EGG_BEGIN; // Staking start time - beginning of egg generation
  const eggTimeNow = TIME_NOW - DINO_EGG_BEGIN; // Time now on egg timeline scale

  var passed = Math.trunc(eggTimeStartStake / DINO_EGG_THIRD); // How many 'thirdenings' proceeded the initial staking start

  var rate = INIT_RATE * Math.pow(3, passed); // Define initial rate at the time of the staking start date
  var curEarningEgg = 0;
  var eggTimeStakeInt = eggTimeStartStake;
  var eggTimeStart = eggTimeStartStake;

  while (DINO_EGG_THIRD * (passed + 1) < eggTimeNow) {
    // While time now on eggtimeline is after the next 'thirdening' we can calulate the earned egg for a whole period with a constant rate
    const current = DINO_EGG_THIRD * (passed + 1);
    const remain = current - eggTimeStakeInt;

    curEarningEgg += (aMintStaked * remain) / rate;
    eggTimeStakeInt = current;
    eggTimeStart = DINO_EGG_THIRD * (passed + 1);
    passed = Math.trunc(eggTimeStakeInt / DINO_EGG_THIRD);
    rate = INIT_RATE * Math.pow(3, passed);
  }

  const remain = eggTimeNow - eggTimeStart;
  curEarningEgg += (aMintStaked * remain * rateDiv) / rate; // Calculate remaing egg

  if (0 > alreadyEarnedEgg + curEarningEgg) {
    return 0;
  }

  return alreadyEarnedEgg + curEarningEgg;
}

export function calculateEstimatedEarnEgg30(
  stakingAcctInfo: any,
  rate: number,
  rateDiv: number,
  aMintStaked: any
): number {
  const CONST_RATE = rate * Math.pow(3, 1);
  const period = 30 * 24 * 60 * 60;

  const curEarningEgg = (aMintStaked * period * rateDiv) / CONST_RATE;

  // curEarningEgg = (aMintStaked * timeRemainingInPeriod * rateDiv) / rate;

  return curEarningEgg;
}

export function calculateEstimatedEarnEgg(
  stakingAcctInfo: any,
  rate: number,
  rateDiv: number,
  aMintStaked: any
): number {
  const DINO_EGG_BEGIN = 1626912000;
  var TIME_NOW = Math.round(Date.now() / 1000);
  const DINO_EGG_THIRD = 66 * 24 * 60 * 60;
  const INIT_RATE = rate * Math.pow(3, 0);

  const eggTimeNow = TIME_NOW - DINO_EGG_BEGIN; // Time now on egg timeline scale

  var passed = Math.trunc(eggTimeNow / DINO_EGG_THIRD); // How many 'thirdenings' proceeded the current time
  var rate = INIT_RATE * Math.pow(3, passed); // Define initial rate at the time of the staking start date
  var curEarningEgg = 0;

  const current = DINO_EGG_THIRD * (passed + 1);
  const remain = current - eggTimeNow;

  curEarningEgg = (aMintStaked * remain * rateDiv) / rate;

  // curEarningEgg = (aMintStaked * timeRemainingInPeriod * rateDiv) / rate;

  return curEarningEgg;
}

export function checkTriceratopsBonus(stakeAcctInfo: any): boolean {
  const dinoStake = stakeAcctInfo?.dinoMintStaked
    ? stakeAcctInfo.dinoMintStaked.toNumber() / 1000000
    : 0;

  const rayStake = stakeAcctInfo?.raydiumLpMintStaked
    ? stakeAcctInfo.raydiumLpMintStaked.toNumber() / 1000000
    : 0;

  const stepStake = stakeAcctInfo?.stepLpMintStaked
    ? stakeAcctInfo.stepLpMintStaked.toNumber() / 1000000
    : 0;

  const dinoValue = dinoStake > 0 ? true : false;
  const rayValue = rayStake > 0 ? true : false;
  const stepValue = stepStake > 0 ? true : false;

  if (dinoValue && rayValue && stepValue) {
    return true;
  }

  return false;
}

export function checkCalibrationBonus(stakeAcctInfo: any): boolean {
  const dinoTimeStamp =
    stakeAcctInfo?.currentStakeUnixTimestamp?.toNumber() ?? 1626912000;
  var TIME_NOW = Math.round(Date.now() / 1000);

  const difference = (TIME_NOW - dinoTimeStamp) / 3600;
  if (difference > 38) {
    return false;
  }
  return true;
}

export function calculateResearchDaysLeft(): string {
  const DINO_EGG_BEGIN = 1626912000;
  var TIME_NOW = Math.round(Date.now() / 1000);
  const DINO_EGG_THIRD = 66 * 24 * 60 * 60;

  const eggTimeNow = TIME_NOW - DINO_EGG_BEGIN; // Time now on egg timeline scale

  var passed = Math.trunc(eggTimeNow / DINO_EGG_THIRD); // How many 'thirdenings' proceeded the current time

  const current = DINO_EGG_THIRD * (passed + 1);
  const remain = current - eggTimeNow;

  return Math.floor(remain / (3600 * 24)).toFixed(0);
}

export function calculateBalances(
  tokenAccounts?: models.ISplAccounts[],
  ata?: models.ITokenAccount,
  decimals?: number
): number {
  const ataBalance = Number(
    ata?.ataInfo?.parsed.info.tokenAmount.uiAmount ?? 0
  );
  const auxBalance = Number(
    tokenAccounts?.reduce(
      (a, b) => a + b.account.data.parsed.info.tokenAmount.uiAmount,
      0
    ) ?? 0
  );
  const totalBalance = ataBalance + auxBalance;

  return totalBalance;
}

export function getAccountWithBalance(
  tokenAccounts?: models.ISplAccounts[],
  ata?: models.ITokenAccount
) {
  const ataPubkey =
    ata?.ataInfo?.parsed.info.tokenAmount.uiAmount && ata?.pubkey;
  const auxPubkey = tokenAccounts?.find(
    (value) => value?.account?.data?.parsed.info.tokenAmount.uiAmount > 0
  )?.pubkey;

  return auxPubkey ?? ataPubkey;
}

export function setDecimal(amount: number, decimals?: number): number {
  return amount / Math.pow(10, decimals ? decimals : 0);
}

export function numberWithCommas(value: string) {
  var parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export function numberWithSpaces(value: string) {
  var parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
