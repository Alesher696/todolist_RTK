import {Dispatch} from "redux";
import {ActionsType} from "./store";
import {AuthAPI} from "../api/todolist-api";
import {setIsLoggedInAC, setLoginAC} from "./authReduser";


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type appActionsType =
    ReturnType<typeof setStatusAC> |
    ReturnType<typeof setErrorAC> |
    ReturnType<typeof setIsInitializedAC> |
    ReturnType<typeof setBackgroundURLAC>

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as string | null,
    isInitialized: false,
    BackgroundURL: ''
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: appActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR' :
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        case 'APP/SET-BACKGROUND-URL':
            return {...state, BackgroundURL: action.url}
        default:
            return state
    }
}

export const setBackgroundURLAC = (url: string) => {
    return {
        type: 'APP/SET-BACKGROUND-URL',
        url
    } as const
}

export const setStatusAC = (status: RequestStatusType) => {
    return {
        type: 'APP/SET-STATUS',
        status
    } as const
}

export const setErrorAC = (error: string | null) => {
    return {
        type: 'APP/SET-ERROR',
        error
    } as const
}

export const setIsInitializedAC = (isInitialized: boolean) => {
    return {
        type: 'APP/SET-IS-INITIALIZED',
        isInitialized
    } as const
}

export const initializeAppTC = () => (dispatch: Dispatch<ActionsType>) => {

    AuthAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setLoginAC(res.data.data.login))
            dispatch(setIsLoggedInAC(true));

            // } else if (res.data.resultCode === 1) {
            //         handleServerAppError(res.data, dispatch)
            //     }
        }
        dispatch(setIsInitializedAC(true))
    })
}

export const setBackGroundURLTC = (url:string)=> (dispatch:Dispatch<ActionsType>) =>{
    localStorage.setItem('backgroundURL', JSON.stringify(url))
    dispatch(setBackgroundURLAC(url))
}
export const getBackGroundURLTC = ()=> (dispatch:Dispatch<ActionsType>)=>{
    let backGroundURL = localStorage.getItem('backgroundURL')
    if (backGroundURL) {
        let newBackGroundURL = JSON.parse(backGroundURL)
       dispatch(setBackgroundURLAC(newBackGroundURL))
}
}