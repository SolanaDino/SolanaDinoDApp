import { Dispatch } from "react";
import { TOGGLE_RIGHT_SIDEBAR } from "./const";

export const toggleRightSidebar = () => (dispatch: Dispatch<{}>) => {
  dispatch({
    type: TOGGLE_RIGHT_SIDEBAR,
  });
};
