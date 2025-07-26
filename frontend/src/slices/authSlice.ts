import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface authSliceState {
    user: {
        id: number,
        username: string,
        email: string
    }
}

const initialState = {
    user: {
        id: 0,
        username: '',
        email: ''
    }
} satisfies authSliceState

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokenData: (state, action: PayloadAction<{ id: number, username: string, email: string }>) => {
            state.user.id = action.payload.id;
            state.user.username = action.payload.username;
            state.user.email = action.payload.email;
        }
    }
})

export const { setTokenData } = authSlice.actions
export default authSlice.reducer