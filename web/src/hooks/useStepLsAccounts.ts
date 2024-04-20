import { useLoveShackContext } from "contexts/loveshack";
import * as models from "models";

export function useStepLsAccounts() {
  const context = useLoveShackContext();
  return {
    stepLsAccts: context.stepLsAccts as models.LoveshackAccounts,
  };
}
