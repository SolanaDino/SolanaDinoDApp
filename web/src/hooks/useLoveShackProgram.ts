import { Program } from "@project-serum/anchor";

import { useLoveShackContext } from "contexts/loveshack";

export function useLoveShackProgram() {
  const context = useLoveShackContext();
  return {
    loveShackProgram: context.loveShackProgram as Program,
  };
}
