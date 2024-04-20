import { Program } from "@project-serum/anchor";

import { useHatcherContext } from "contexts/hatcher";

export function useHatcherProgram() {
  const context = useHatcherContext();
  return {
    hatcherRealProgram: context.hatcherRealProgram as Program,
    hatcherFakeProgram: context.hatcherFakeProgram as Program,
  };
}
