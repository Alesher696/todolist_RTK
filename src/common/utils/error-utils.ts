import {Dispatch} from 'redux'
import {ResponseType} from 'common/api/todolist-api'
import {appActions} from "app/appSlice";
import axios, {AxiosError} from "axios";

// generic function
export const handleServerAppError = <T>(result: ResponseType<T>, dispatch: Dispatch) => {
    if (result.messages.length) {
        dispatch(appActions.setError({error: result.messages[0]}))
    } else {
        dispatch(appActions.setError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setStatus({status: 'failed'}))
}

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {

    const error = e as Error | AxiosError<{ error: string }>
    if (axios.isAxiosError(error)) {
        const err = error.message ? error.message :'Some Error occurred'
        dispatch(appActions.setError({error: err}))
    } else
        dispatch(appActions.setStatus({status: 'failed'}))
}
