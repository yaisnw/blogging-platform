import { createSlice } from '@reduxjs/toolkit'

interface uiSlice {
    justRegistered: boolean;
    pendingPostId: number
}

const initialState = {
    justRegistered: false,
    pendingPostId: 0,
} satisfies uiSlice

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setJustRegistered: (state, action) => {
            state.justRegistered = action.payload;
        },
        setPostId: (state, action) => {
            state.pendingPostId = action.payload;
        }
    },
})

export const { setJustRegistered, setPostId } = uiSlice.actions
export default uiSlice.reducer