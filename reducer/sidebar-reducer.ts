import { useReducer } from "react";

interface SidebarState {
  isCollapsed: boolean;
}

type SidebarAction =
  | { type: "TOGGLE" }

const initialState: SidebarState = {
  isCollapsed: false,
};

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, isCollapsed: !state.isCollapsed };
    default:
      return state;
  }
}

export function useSidebarReducer() {
  return useReducer(sidebarReducer, initialState);
}
