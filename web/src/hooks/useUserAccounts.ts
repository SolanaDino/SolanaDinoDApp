import { useAccountsContext } from "contexts/accounts";
import * as models from "models";

export function useUserAccounts() {
  const context = useAccountsContext();
  return {
    userAccounts: context.tokenAccounts as models.ISplAccounts[],
  };
}
