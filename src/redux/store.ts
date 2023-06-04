import {applyMiddleware, combineReducers, createStore} from "redux";
import {todolistReducer, todolistsActionType} from "./todolistReducer";
import {tasksActionType, tasksReducer} from "./tasksReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appActionsType, appReducer} from "./appReducer";
import {AuthActionsType, authReducer} from "./authReduser";


const rootReducer = combineReducers({
    todolist: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer
})


export type storeType = ReturnType<typeof rootReducer>
export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown,ActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, ActionsType>

//==============================================================================

export type ActionsType = tasksActionType | todolistsActionType | appActionsType | AuthActionsType

