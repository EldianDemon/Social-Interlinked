import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API } from '../api/api.js'

const initialState = {
    isFetching: true,
    isAuth: false,
    message: '',
    user: {}
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setFetching: (state, { payload }) => {
            state.isFetching = payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, () => {
                console.log('Checking if user is auth')
            })
            .addCase(checkAuth.fulfilled, (state, { payload }) => {
                state.isAuth = payload?.success
                state.message = payload?.message
            })
            .addCase(checkAuth.rejected, () => {
                console.log('Error while checking user auth')
            })
    }
})

export const { setFetching } = authSlice.actions

export const checkAuth = createAsyncThunk(
    'auth/check',
    async () => {
        const data = await API.checkAuth()
        console.log('Санка')
        return data
    }
)

export default authSlice.reducer