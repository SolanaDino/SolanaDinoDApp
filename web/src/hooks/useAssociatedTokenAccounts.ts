import { useAccountsContext } from "contexts/accounts";
import * as models from "models";

export function useAssociatedTokenAccounts() {
  const context = useAccountsContext();
  return {
    ataMap: context.ataMap as Map<string, models.ITokenAccount>,
  };
}
