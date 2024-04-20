import { useLoveShackContext } from "contexts/loveshack";
import * as models from "models";

export function useRaydiumLsAccounts() {
  const context = useLoveShackContext();
  return {
    raydiumLsAccts: context.raydiumLsAccts as models.LoveshackAccounts,
  };
}
