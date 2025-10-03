import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  postId: number
  deletingPostIds: number[]
  tabState: "posts" | "comments" | "users"
  searchQuery: string
  imageUploading: boolean
}

const initialState: UiState = {
  postId: 0,
  deletingPostIds: [],
  tabState: "posts",
  searchQuery: "",
  imageUploading: false,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setPostId: (state, action: PayloadAction<number>) => {
      state.postId = action.payload
    },
    addDeletingPostIds: (state, action: PayloadAction<number>) => {
      const id = action.payload
      if (state.deletingPostIds.includes(id)) {
        state.deletingPostIds = state.deletingPostIds.filter(
          (postId) => postId !== id
        )
      } else {
        state.deletingPostIds.push(id)
      }
    },
    setTabState: (state, action: PayloadAction<"posts" | "comments" | "users">) => {
      state.tabState = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearSearchQuery: (state) => {
      state.searchQuery = ""
    },
    setImageUploading: (state, action: PayloadAction<boolean>) => {
      state.imageUploading = action.payload
    },
  },
})

export const {
  setPostId,
  addDeletingPostIds,
  setTabState,
  setSearchQuery,
  clearSearchQuery,
  setImageUploading
} = uiSlice.actions
export default uiSlice.reducer

export type { UiState };
