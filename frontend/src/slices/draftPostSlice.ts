import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface draftPost {
  title: string;
  content: string;
}

const initialState: draftPost = {
  title: "",
  content: "",
};

const draftPostSlice = createSlice({
  name: "draftPost",
  initialState,
  reducers: {
    setDraftTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setDraftContent(state, action: PayloadAction<string>) {
      state.content = action.payload;
    },
    resetdraftPost(state) {
      state.title = "";
      state.content = "";
    },
  },
});

export const { setDraftTitle, setDraftContent, resetdraftPost } = draftPostSlice.actions;
export default draftPostSlice.reducer;
