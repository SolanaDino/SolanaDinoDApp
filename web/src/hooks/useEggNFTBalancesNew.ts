import * as utils from "utils";
import * as hooks from "hooks";
import * as consts from "consts";
import * as models from "models";

export function useEggNFTBalanceNew() {
  const groupedAuxTokenAccounts = hooks.useGroupedAuxTokenAccounts();
  const { ataMap } = hooks.useAssociatedTokenAccounts();

  const auxAcctsNFT1 = groupedAuxTokenAccounts.get(consts.NFT1.toString());
  const ataNFT1 = ataMap.get(consts.NFT1.toString());

  const auxAcctsNFT2 = groupedAuxTokenAccounts.get(consts.NFT2.toString());
  const ataNFT2 = ataMap.get(consts.NFT2.toString());

  const auxAcctsNFT3 = groupedAuxTokenAccounts.get(consts.NFT3.toString());
  const ataNFT3 = ataMap.get(consts.NFT3.toString());

  const auxAcctsNFT4 = groupedAuxTokenAccounts.get(consts.NFT4.toString());
  const ataNFT4 = ataMap.get(consts.NFT4.toString());

  const balanceNFT1 = utils.calculateBalances(auxAcctsNFT1, ataNFT1, 0);
  const balanceNFT2 = utils.calculateBalances(auxAcctsNFT2, ataNFT2, 0);
  const balanceNFT3 = utils.calculateBalances(auxAcctsNFT3, ataNFT3, 0);
  const balanceNFT4 = utils.calculateBalances(auxAcctsNFT4, ataNFT4, 0);

  return {
    BLUE: { balance: balanceNFT1 },
    GREEN: { balance: balanceNFT2 },
    PURPLE: { balance: balanceNFT3 },
    MYTHICAL: { balance: balanceNFT4 },
  } as models.IEggBalancesMap;
}
