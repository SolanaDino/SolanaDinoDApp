import * as hooks from "hooks";
import * as utils from "utils";
import * as consts from "consts";

export function useEggBalance() {
  const groupedAuxTokenAccounts = hooks.useGroupedAuxTokenAccounts();
  const { ataMap } = hooks.useAssociatedTokenAccounts();

  const auxAcctsEgg = groupedAuxTokenAccounts.get(consts.EGG_MINT.toString());
  const ataEgg = ataMap.get(consts.EGG_MINT.toString());

  const balanceEgg = utils.calculateBalances(auxAcctsEgg, ataEgg, 6);
  return {
    balanceEgg: balanceEgg as number,
  };
}
