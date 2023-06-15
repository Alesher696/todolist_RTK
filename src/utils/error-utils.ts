import {Dispatch} from 'redux'
import {ResponseType} from '../api/todolist-api'
import {appActions} from "redux/appSlice";

// generic function
export const handleServerAppError = <T>(result: ResponseType<T>, dispatch: Dispatch) => {
    if (result.messages.length) {
        dispatch(appActions.setError({error: result.messages[0]}))
    } else {
        dispatch(appActions.setError({error: 'Some error occurred'}))
    }
    dispatch(appActions.setStatus({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(appActions.setError({error: error.message}))
    dispatch(appActions.setStatus({status: 'failed'}))
}
