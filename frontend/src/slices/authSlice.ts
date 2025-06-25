import { createSlice } from '@reduxjs/toolkit'

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
    reducers: {}
})

// export const {} = authSlice.actions
export default authSlice.reducer