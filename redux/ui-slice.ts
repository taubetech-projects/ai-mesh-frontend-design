import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InterfaceType = 'chat' | 'image';

interface UiState {
    activeInterface: InterfaceType;
}

const initialState: UiState = {
    activeInterface: 'chat',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveInterface: (state, action: PayloadAction<InterfaceType>) => {
            state.activeInterface = action.payload;
        },
    },
});

export const { setActiveInterface } = uiSlice.actions;
export default uiSlice.reducer;