import * as utils from "utils";
import * as hooks from "hooks";
import * as consts from "consts";
import * as models from "models";

export function useDinoTokenBalances() {
  const groupedAuxTokenAccounts = hooks.useGroupedAuxTokenAccounts();
  const { ataMap } = hooks.useAssociatedTokenAccounts();

  const auxAcctsDino = groupedAuxTokenAccounts.get(consts.DINO_MINT.toString());
  const auxAcctsRayDinoLp = groupedAuxTokenAccounts.get(
    consts.DINO_RAYDIUMLP_MINT.toString()
  );
  const auxAcctsStepDinoLp = groupedAuxTokenAccounts.get(
    consts.DINO_STEPLP_MINT.toString()
  );
  const auxAcctsEgg = groupedAuxTokenAccounts.get(consts.EGG_MINT.toString());

  const ataDino = ataMap.get(consts.DINO_MINT.toString());
  const ataEgg = ataMap.get(consts.EGG_MINT.toString());
  const ataRayDinoLp = ataMap.get(consts.DINO_RAYDIUMLP_MINT.toString());
  const ataStepDinoLp = ataMap.get(consts.DINO_STEPLP_MINT.toString());

  const balanceDino = utils.calculateBalances(auxAcctsDino, ataDino, 6);
  const balanceRayDinoLp = utils.calculateBalances(
    auxAcctsRayDinoLp,
    ataRayDinoLp,
    6
  );
  const balanceStepDinoLp = utils.calculateBalances(
    auxAcctsStepDinoLp,
    ataStepDinoLp,
    8
  );
  const balanceEgg = utils.calculateBalances(auxAcctsEgg, ataEgg, 6);

  var dinoTokenBalances = <models.DinoTokenBalances>{};

  dinoTokenBalances.dinoBalance = balanceDino;
  dinoTokenBalances.dinoRayBalance = balanceRayDinoLp;
  dinoTokenBalances.dinoStepBalance = balanceStepDinoLp;
  dinoTokenBalances.eggBalance = balanceEgg;

  return dinoTokenBalances;
}
