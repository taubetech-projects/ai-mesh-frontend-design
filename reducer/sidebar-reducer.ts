import { useReducer } from "react";

import {
  TOGGLE_SIDEBAR
} from "./constants";

interface SidebarState {
  isCollapsed: boolean;
}

type SidebarAction =
  | { type: typeof TOGGLE_SIDEBAR }

const initialState: SidebarState = {
  isCollapsed: false,
};

function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return { ...state, isCollapsed: !state.isCollapsed };
    default:
      return state;
  }
}

export function useSidebarReducer() {
  return useReducer(sidebarReducer, initialState);
}
