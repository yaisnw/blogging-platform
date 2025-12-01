import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface authSliceState {
    user: {
        id: number,
        username: string,
        email: string,
        avatar_url: string
    },
    justRegistered: boolean;
}

const initialState = {
    user: {
        id: 0,
        username: '',
        email: '',
        avatar_url: ''
    },
    justRegistered: false as boolean,
} satisfies authSliceState

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setJustRegistered: (state, action: PayloadAction<boolean>) => {
            state.justRegistered = action.payload;
        },
        setTokenData: (state, action: PayloadAction<{ id: number, username: string, email: string, avatar_url: string }>) => {
            state.user.id = action.payload.id;
            state.user.username = action.payload.username;
            state.user.email = action.payload.email;
            state.user.avatar_url = action.payload.avatar_url
        },
        setAvatarUrl: (state, action: PayloadAction<string>) => {
            state.user.avatar_url = action.payload;
        },
        logOut: (state) => {
            state.user = { id: 0, username: '', email: '', avatar_url: '' }
            state.justRegistered = false;
        }
    }
})

export const { setJustRegistered, setTokenData, setAvatarUrl, logOut } = authSlice.actions
export default authSlice.reducer