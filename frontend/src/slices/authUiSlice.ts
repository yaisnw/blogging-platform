import { createSlice } from '@reduxjs/toolkit'

interface authUiState {
    justRegistered: boolean;
}

const initialState = {
    justRegistered: false,
} satisfies authUiState

const authUiSlice = createSlice({
    name: 'authUi',
    initialState,
    reducers: {
        setJustRegistered: (state, action) => {
            state.justRegistered = action.payload;
        }
    },
})

export const { setJustRegistered } = authUiSlice.actions
export default authUiSlice.reducer