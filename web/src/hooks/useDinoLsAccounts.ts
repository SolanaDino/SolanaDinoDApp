import { useLoveShackContext } from "contexts/loveshack";
import * as models from "models";

export function useDinoLsAccounts() {
  const context = useLoveShackContext();
  return {
    dinoLsAccts: context.dinoLsAccts as models.LoveshackAccounts,
  };
}
