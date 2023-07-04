import {AppThunk} from "app/store";
import {TodolistAPI, TodolistType} from "common/api/todolist-api";
import {tasksThunks} from "features/tasks/tasksSlice";
import {appActions, RequestStatusType} from "app/appSlice";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "common/utils/app-async-thunk";


export type domainTodolistType = TodolistType & { filter: string, entityStatus: RequestStatusType }

const initialState: domainTodolistType[] = [
    // {id: todolistId1, title: "What to learn", filter: 'all', entityStatus: RequestStatusType },
    // {id: todolistId2, title: "What to buy", filter: 'all'}
]

const getTodolist = createAppAsyncThunk<{todolists: TodolistType[]}>('todolists/GetTodolist', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const result = await TodolistAPI.getTodolist()

        result.map(el => {
            return (dispatch(tasksThunks.getTasks(el.id)))
        })

        return {todolists: result}
    } catch (e) {
        return rejectWithValue(e)
    }
})

const addTodolist = createAppAsyncThunk<{todolist: TodolistType}, string>('todolists/AddTodolist', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const result = await TodolistAPI.addTodolist(arg)
        dispatch(appActions.setStatus({status: 'succeeded'}))
        return {todolist: result.data.data.item}
    } catch (e) {
        return rejectWithValue(e)
    }
})

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {
        RemoveTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            // return state.filter(el => el.id !== action.todolistId)
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        },
        ChangeTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            // return [...state.map(el => el.id === action.id ? {...el, title: action.title} : el)]
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.title = action.payload.title
            }
        },
        ChangeTodolistFilter: (state, action: PayloadAction<{ todolistId: string, newFilter: string }>) => {
            // return [...state.map(el => el.id === action.id ? {...el, filter: action.newFilter} : el)]
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.filter = action.payload.newFilter
            }
        },
        setEntityStatus: (state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) => {
            // return state.map(el => el.id === action.todoListId ? {...el, entityStatus: action.entityStatus} : el)
            const todo = state.find(todo => todo.id === action.payload.todoListId)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTodolist.fulfilled, (state, action) => {
            return action.payload.todolists.map((el: any) => ({...el, filter: 'all', entityStatus: 'idle'}))
        })
            .addCase(addTodolist.fulfilled, (state, action) => {
                const newTodo: domainTodolistType = {...action.payload.todolist, entityStatus: 'idle', filter: 'all'}
                state.unshift(newTodo)
            })
    }

})

export const todolistReducer = slice.reducer
export const todolistActions = slice.actions
export const todolistThunk = {getTodolist, addTodolist}

//========================================RequireToRefactor===================================================

export const DeleteTodolistTC = (todolistId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(todolistActions.setEntityStatus({todoListId: todolistId, entityStatus: 'loading'}))
        const result = await TodolistAPI.deleteTodolist(todolistId)
        dispatch(todolistActions.RemoveTodolist({todolistId: todolistId}))
    } catch (e) {
        console.log(e)
    }
}

export const UpdateTodoListTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    TodolistAPI.updateTodoList(todolistId, title)
        .then(res => dispatch(todolistActions.ChangeTodolistTitle({todolistId: todolistId, title: title})))
        .catch(e => console.log(e))
}
