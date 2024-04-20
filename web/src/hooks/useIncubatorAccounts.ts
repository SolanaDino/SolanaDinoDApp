import { useIncubatorContext } from "contexts/incubator";
import * as models from "models";

export function useIncubatorAccounts() {
  const context = useIncubatorContext();
  return {
    incubatorAccts: context.incubatorAccts as models.IncubatorAccounts,
  };
}
