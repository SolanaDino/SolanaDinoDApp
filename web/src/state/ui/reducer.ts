import { TOGGLE_RIGHT_SIDEBAR } from "./const";

export interface UIReducerProps {
  rightSidebar: boolean;
}

const initialState: UIReducerProps = {
  rightSidebar: false,
};

export default function TournamentsDataReducer(
  state = initialState,
  action: any = {}
) {
  switch (action.type) {
    case TOGGLE_RIGHT_SIDEBAR:
      return {
        ...state,
        rightSidebar: !state.rightSidebar,
      };
    default:
      return state;
  }
}
