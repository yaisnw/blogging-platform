import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface uiSlice {
    justRegistered: boolean;
    postId: number;
    deletingPostIds: number[];
}

const initialState: uiSlice = {
    justRegistered: false,
    postId: 0,
    deletingPostIds: [],
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setJustRegistered: (state, action: PayloadAction<boolean>) => {
            state.justRegistered = action.payload;
        },
        setPostId: (state, action: PayloadAction<number>) => {
            state.postId = action.payload;
        },
        addDeletingPostIds: (state, action: PayloadAction<number>) => {
            const id = action.payload
            if (state.deletingPostIds.includes(id)) {
                state.deletingPostIds = state.deletingPostIds.filter(postId => postId !== id)
            } else {
                state.deletingPostIds.push(id)
            }
        }
    },
})

export const { setJustRegistered, setPostId, addDeletingPostIds } = uiSlice.actions
export default uiSlice.reducer