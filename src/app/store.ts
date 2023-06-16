import {todolistReducer} from "features/todolist/todolistSlice";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer} from "app/appSlice";
import {authReducer} from "features/login/authSlice";
import {AnyAction, combineReducers, configureStore} from "@reduxjs/toolkit";
import {taskReducer} from "features/tasks/tasksSlice";


const rootReducer = combineReducers({
    todolist: todolistReducer,
    tasks: taskReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer
    // middleware:(getDefaultMiddleware)=> getDefaultMiddleware().prepend(thunkMiddleware) add additional middleWare
})




export type storeType = ReturnType<typeof rootReducer>

// export const store = createStore(rootReducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = ThunkDispatch<RootState, unknown,AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>



