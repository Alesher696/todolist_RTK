import {Dispatch} from "redux";
import {TaskPriority, TasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "api/todolist-api";
import {AppThunk, storeType} from "./store";
import {appActions, RequestStatusType} from "redux/appSlice";
import {handleServerAppError} from "utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistActions} from "redux/todolistSlice";

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriority
    startDate?: Date
    deadline?: Date
}


const getTasks = createAsyncThunk(
    'tasks/getTasks',
    async (todolistId: string, thunkAPI)=>{
        const {dispatch} = thunkAPI
        const result = await TasksAPI.getTasks(todolistId)
        const tasks = result.data.items
        // dispatch(taskActions.getTasks({todolistId: todolistId, tasks: result.data.items}))
        dispatch(appActions.setStatus({status: 'succeeded'}))
        return {tasks, todolistId}
    }
)

export type TasksType = TaskType & { entityTaskStatus: string }

export type initialStateTaskType = {
    [key: string]: TasksType[]
}

const initialState: initialStateTaskType = {}


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        AddTask: (state, action: PayloadAction<{ todolistId: string, newTask: TasksType }>) => {
            // return {...state, [action.todolistId]: [{...action.newTask, entityTaskStatus: 'idle'}, ...state[action.todolistId]]}
            const tasks = state[action.payload.todolistId]
            tasks.unshift({...action.payload.newTask, entityTaskStatus:'idle'})
        },
        RemoveTask: (state, action: PayloadAction<{ todoListId: string, taskId: string }>) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex((t: TasksType) => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        UpdateTask: (state, action: PayloadAction<{ todoListId: string, taskId: string, model: any }>) => {
            // return {...state, action.payload.todoListId]:state[action.payload.todoListId].map((t: TasksType) => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)}
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex((t: TasksType) => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        // getTasks: (state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) => {
        //     // return {...state, [action.payload.todolistId]: action.payload.tasks.map(el => ({...el, entityTaskStatus: 'idle'}))}
        //     state[action.payload.todolistId] = action.payload.tasks.map((el) => ({...el, entityTaskStatus: 'idle'}))
        //
        // },
        setEntityTaskStatus: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            // return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(el => ({...el, entityTaskStatus: action.payload.status}))}
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t: TasksType) => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], entityTaskStatus:action.payload.status}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(todolistActions.AddTodolist, (state, action) => {
            // return {...state, [action.payload.todolist.id]: []}
            state[action.payload.todolist.id] = []
        })
            .addCase(todolistActions.RemoveTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(getTasks.fulfilled, (state,action)=>{
                state[action.payload.todolistId] = action.payload.tasks.map((el:TasksType) => ({...el, entityTaskStatus: 'idle'}))
            })
        // .addCase(todolistActions.getTodoLists, (state, action)=>{
        //     action.payload.todolists.forEach((tl)=>{
        //         state[tl.id] = []
        //     })
        // })
    }
})

export const taskReducer = slice.reducer
export const taskActions = slice.actions
export const tasksThunks = {getTasks}



export const addTaskTC = (todolistId: string, title: string): AppThunk => async (dispatch) => {

    // TasksAPI.addTask(todolistId, title)
    //     .then(result => {
    //             if (result.data.resultCode === 0) {
    //                 dispatch(AddTaskAC(todolistId, result.data.data.item))
    //             } else {
    //                 if (result.data.messages.length) {
    //                     console.log(result)
    //                     dispatch(setErrorAC(result.data.messages[0]))
    //                 } else {
    //                     dispatch(setErrorAC('Some error occurred'))
    //                 }
    //             }
    //         }
    //     )

    dispatch(appActions.setStatus({status: 'loading'}))
    dispatch(todolistActions.setEntityStatus({todoListId: todolistId, entityStatus: 'loading'}))
    const result = await TasksAPI.addTask(todolistId, title)
    if (result.data.resultCode === 0) {
        dispatch(taskActions.AddTask({todolistId: todolistId, newTask: result.data.data.item}))
        dispatch(todolistActions.setEntityStatus({todoListId: todolistId, entityStatus: 'succeeded'}))
        dispatch(appActions.setStatus({status: 'succeeded'}))

    } else {
        if (result.data.messages.length) {
            dispatch(appActions.setError({error: result.data.messages[0]}))
            dispatch(appActions.setStatus({status: 'failed'}))
            dispatch(todolistActions.setEntityStatus({todoListId: todolistId, entityStatus: 'failed'}))

        } else {
            dispatch(appActions.setError({error: 'Some error occurred'}))
            dispatch(appActions.setStatus({status: 'failed'}))
            dispatch(todolistActions.setEntityStatus({todoListId: todolistId, entityStatus: 'failed'}))

        }
    }
}

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => async (dispatch) => {
    try {
        dispatch(taskActions.setEntityTaskStatus({todolistId: todolistId, taskId: taskId, status: 'loading'}))
        const result = await TasksAPI.deleteTask(todolistId, taskId)
        dispatch(taskActions.RemoveTask({todoListId: todolistId, taskId: taskId}))
        dispatch(taskActions.setEntityTaskStatus({todolistId: todolistId, taskId: taskId, status: 'idle'}))
    } catch (e) {
        console.log(e)
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => async (dispatch: Dispatch, getState: () => storeType) => {
    const state = getState()
    const task = state.tasks[todolistId].find((t: TasksType) => t.id === taskId)
    if (!task) {
        //throw new Error("task not found in the state");
        console.warn('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: new Date(),
        deadline: new Date(),
        ...model
    }

    const result = await TasksAPI.updateTask(todolistId, taskId, apiModel)
    if (result.data.resultCode === 0) {
        dispatch(taskActions.UpdateTask({todoListId: todolistId, taskId: taskId, model: apiModel}))
    } else {
        handleServerAppError(result.data, dispatch)
    }
}

