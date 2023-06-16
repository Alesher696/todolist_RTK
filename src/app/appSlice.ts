import {Dispatch} from "redux";
import {AuthAPI} from "common/api/todolist-api";
import {authActions} from "features/login/authSlice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "app/store";

// export type InitialStateType = typeof initialState
//
// const initialState = {
//   status: 'idle' as RequestStatusType,
//   error: null as string | null,
//   isInitialized: false,
//   BackgroundURL: ''
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as string | null,
        isInitialized: false,
        BackgroundURL: ''
    },
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
    }
})

export const appReducer = slice.reducer
export const appActions = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    AuthAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setLogin({login: res.data.data.login}))
            dispatch(authActions.setIsLoggedIn({value: true}));

            // } else if (res.data.resultCode === 1) {
            //         handleServerAppError(res.data, dispatch)
            //     }
        }
        dispatch(appActions.setIsInitialized({isInitialized: true}))
    })
}

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