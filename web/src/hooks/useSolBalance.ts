import { useAccountsContext } from "contexts/accounts";

export function useSolBalance() {
  const context = useAccountsContext();
  return {
    solBalance: context.solBalance,
  };
}
