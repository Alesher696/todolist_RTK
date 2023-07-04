import {AppThunk} from "app/store";
import {AuthAPI, LoginParamsType} from "common/api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "common/utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/appSlice";



export type InitialStateType = typeof initialState
const initialState = {
    isLoggedIn: false,
    login: ''
}



const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ value: boolean }>) => {
            // return {...state, isLoggedIn: action.value}
            state.isLoggedIn = action.payload.value
        },
        setLogin: (state, action: PayloadAction<{ login: string }>) => {
            // return {...state, login: action.login}
            state.login = action.payload.login
        }
    }
})

export const authReducer = slice.reducer
// export const {setIsLoggedIn,setLoginAC} = slice.actions
export const authActions = slice.actions

export const loginTC = (data: LoginParamsType): AppThunk => async (dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const result = await AuthAPI.AuthLogin(data)
        if (result.data.resultCode === 0) {
            dispatch(appActions.setStatus({status: 'succeeded'}))
            dispatch(authActions.setIsLoggedIn({value: true}))
            console.log(result)
            // }else if (result.data.resultCode === 1) {
            //     debugger
            //         handleServerAppError(result.data, dispatch)
            // }
        }
    } catch (e) {
        console.log(e)
    }
}

export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setStatus({status: 'loading'}))
    AuthAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({value: false}))
                dispatch(appActions.setStatus({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

