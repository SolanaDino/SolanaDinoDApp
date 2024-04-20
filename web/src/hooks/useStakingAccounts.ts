import { useLoveShackContext } from "contexts/loveshack";
import * as models from "models";

export function useStakingAccounts() {
  const context = useLoveShackContext();
  return {
    stakingAccts: context.stakingAccts as models.StakingAccounts,
  };
}
