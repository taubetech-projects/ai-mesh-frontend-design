// c:\Users\USER\Desktop\ai mesh\ai-mesh-frontend-design\src\features\platform\team\team.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Team {
  id: string;
  name: string;
  [key: string]: any;
}

interface TeamState {
  selectedTeam: Team | null;
}

const initialState: TeamState = {
  selectedTeam: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setSelectedTeam: (state, action: PayloadAction<Team | null>) => {
      state.selectedTeam = action.payload;
    },
  },
});

export const { setSelectedTeam } = teamSlice.actions;
export default teamSlice.reducer;
