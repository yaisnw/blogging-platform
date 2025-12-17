import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  postId: number
  deletingPostIds: number[]
  searchTab: "posts" | "users"
  profileTab: "posts" | "comments"
  searchQuery: string
  imageUploading: boolean
  alertIgnored: boolean
}

const initialState: UiState = {
  postId: 0,
  deletingPostIds: [],
  searchTab: "posts",
  profileTab: "posts",
  searchQuery: "",
  imageUploading: false,
  alertIgnored: false

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
    setSearchTab: (state, action: PayloadAction<"posts" | "users">) => {
      state.searchTab = action.payload
    },
    setProfileTab: (state, action: PayloadAction<"posts" | "comments">) => {
      state.profileTab = action.payload
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
    setAlertIgnored: (state, action: PayloadAction<boolean>) => {
      state.alertIgnored = action.payload
    }
  },
})

export const {
  setPostId,
  addDeletingPostIds,
  setSearchTab,
  setProfileTab,
  setSearchQuery,
  clearSearchQuery,
  setImageUploading,
  setAlertIgnored
} = uiSlice.actions
export default uiSlice.reducer

export type { UiState };
