import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface authSliceState {
    user: {
        id: number ,
        username: string,
        email: string,
        avatar_url: string
    }
}

const initialState = {
    user: {
        id: 0,
        username: '',
        email: '',
        avatar_url: ''
    }
} satisfies authSliceState

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokenData: (state, action: PayloadAction<{ id: number, username: string, email: string, avatar_url: string }>) => {
            state.user.id = action.payload.id;
            state.user.username = action.payload.username;
            state.user.email = action.payload.email;
            state.user.avatar_url = action.payload.avatar_url
        },
        logOut: (state) => {
            state.user.id = 0; 
            state.user.username = '';
            state.user.email = '';
            state.user.avatar_url = '';
        }
    }
})

export const { setTokenData, logOut } = authSlice.actions
export default authSlice.reducer