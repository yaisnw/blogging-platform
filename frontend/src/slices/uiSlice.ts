import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface uiSlice {

    postId: number;
    deletingPostIds: number[];
}

const initialState: uiSlice = {

    postId: 0,
    deletingPostIds: [],
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
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

export const {  setPostId, addDeletingPostIds } = uiSlice.actions
export default uiSlice.reducer