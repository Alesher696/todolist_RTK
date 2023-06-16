import {AppDispatch, AppThunk} from "app/store";
import {TasksAPI, TodolistAPI, TodolistType} from "common/api/todolist-api";
import {taskActions, tasksThunks} from "features/tasks/tasksSlice";
import {appActions, RequestStatusType} from "app/appSlice";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export type domainTodolistType = TodolistType & { filter: string, entityStatus: RequestStatusType }

const initialState: domainTodolistType[] = [
    // {id: todolistId1, title: "What to learn", filter: 'all', entityStatus: RequestStatusType },
    // {id: todolistId2, title: "What to buy", filter: 'all'}
]

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {
        RemoveTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            // return state.filter(el => el.id !== action.todolistId)
            const index = state.findIndex(todo => todo.id === action.payload.todolistId)
            if (index !== -1) state.splice(index, 1)
        },
        AddTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            const newTodo: domainTodolistType = {...action.payload.todolist, entityStatus: 'idle', filter: 'all'}
            state.unshift(newTodo)
        },
        ChangeTodolistTitle: (state, action: PayloadAction<{ todolistId: string, title: string }>) => {
            // return [...state.map(el => el.id === action.id ? {...el, title: action.title} : el)]
            const todo = state.find(todo => todo.id === action.payload.todolistId)
            if (todo) {
                todo.title = action.payload.title
            }
        },
        getTodoLists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map((el: any) => ({...el, filter: 'all', entityStatus: 'idle'}))
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
                todo.title = action.payload.entityStatus
            }
        },
    },

})

export const todolistReducer = slice.reducer
export const todolistActions = slice.actions


export const GetTodolistTC = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const result = await TodolistAPI.getTodolist()
        dispatch(todolistActions.getTodoLists({todolists:result}))
        result.map(el => {
            return (dispatch(tasksThunks.getTasks(el.id)))
        })
    } catch (e) {
        console.log(e)
    }
}

export const AddTodolistTC = (title: string): AppThunk => async (dispatch: Dispatch) => {
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const result = await TodolistAPI.addTodolist(title)
        dispatch(todolistActions.AddTodolist({todolist:result.data.data.item}))
        dispatch(appActions.setStatus({status: 'succeeded'}))

    } catch (e) {
        console.log(e)
    }
}

export const DeleteTodolistTC = (todolistId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(todolistActions.setEntityStatus({todoListId: todolistId, entityStatus: 'loading' }))
        const result = await TodolistAPI.deleteTodolist(todolistId)
        dispatch(todolistActions.RemoveTodolist({todolistId:todolistId}))
    } catch (e) {
        console.log(e)
    }
}

export const UpdateTodoListTC = (todolistId: string, title: string): AppThunk => (dispatch) => {
    TodolistAPI.updateTodoList(todolistId, title)
        .then(res => dispatch(todolistActions.ChangeTodolistTitle({todolistId: todolistId, title: title})))
        .catch(e => console.log(e))
}
