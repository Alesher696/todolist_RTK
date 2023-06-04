import {Dispatch} from 'redux'
import {ActionsType} from "./store";
import {appActionsType, setStatusAC} from "./appReducer";
import {AuthAPI, LoginParamsType} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";


const initialState = {
    isLoggedIn: false,
    login: ''
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case 'login/SET-LOGIN':
            return {...state, login: action.login}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const setLoginAC = (login: string) => {
    return {
        type: 'login/SET-LOGIN',
        login
    } as const
}

export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setStatusAC('loading'))
        const result = await AuthAPI.AuthLogin(data)
        if (result.data.resultCode === 0) {
            dispatch(setStatusAC('succeeded'))
            dispatch(setIsLoggedInAC(true))
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

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    AuthAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC> | ReturnType<typeof setLoginAC> | appActionsType
