import {Dispatch} from "redux";
import {AuthAPI} from "common/api/todolist-api";
import {authActions} from "features/login/authSlice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";
import {createAppAsyncThunk} from "common/utils/app-async-thunk";


const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
  BackgroundURL: ''
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initializedApp = createAppAsyncThunk('app/initialized', async(_,thunkAPI)=>{
   const {dispatch, rejectWithValue } = thunkAPI
    try{
       const result = await AuthAPI.me()
        if (result.data.resultCode === 0) {
                    dispatch(authActions.setLogin({login: result.data.data.login}))
                    dispatch(authActions.setIsLoggedIn({value: true}));
                }
        return {isInitialized: true}
    }
    catch (e) {
        return rejectWithValue(e)
    }
})

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            // return {...state, isInitialized: action.isInitialized}
            state.isInitialized = action.payload.isInitialized
        },
        setError: (state, action: PayloadAction<{ error: string | null }>) => {
            // return {...state, error: action.error}
            state.error = action.payload.error
        },
        setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            // return {...state, status: action.status}
            state.status = action.payload.status
        },
        setBackgroundURL: (state, action: PayloadAction<{ url: string }>) => {
            // return {...state, BackgroundURL: action.url}
            state.BackgroundURL = action.payload.url
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(initializedApp.fulfilled,(state,action)=>{
            state.isInitialized = action.payload.isInitialized
        })
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = {initializedApp}


//========================================RequireToRefactor===================================================

export const setBackGroundURLTC = (url: string):AppThunk => (dispatch: Dispatch) => {
    localStorage.setItem('backgroundURL', JSON.stringify(url))
    dispatch(appActions.setBackgroundURL({url: url}))
}

export const getBackGroundURLTC = ():AppThunk => (dispatch: Dispatch) => {
    let backGroundURL = localStorage.getItem('backgroundURL')
    if (backGroundURL) {
        let newBackGroundURL = JSON.parse(backGroundURL)
        dispatch(appActions.setBackgroundURL({url: newBackGroundURL}))
    }
}
