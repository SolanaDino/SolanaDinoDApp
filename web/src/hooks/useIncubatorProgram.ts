import { Program } from "@project-serum/anchor";

import { useIncubatorContext } from "contexts/incubator";

export function useIncubatorProgram() {
  const context = useIncubatorContext();
  return {
    incubatorProgram: context.incubatorProgram as Program,
  };
}
