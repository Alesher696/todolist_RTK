import { Dispatch } from 'redux'
import { ResponseType } from '../api/todolist-api'
import {appActionsType, setErrorAC, setStatusAC} from "../redux/appReducer";

// generic function
export const handleServerAppError = <T>(result: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (result.messages.length) {
        dispatch(setErrorAC(result.messages[0]))
    } else {
        dispatch(setErrorAC('Some error occurred'))
    }
    dispatch(setStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setErrorAC(error.message))
    dispatch(setStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<appActionsType>