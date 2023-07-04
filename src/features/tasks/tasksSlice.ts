import {
    addTaskArgType,
    TaskPriority,
    TasksAPI,
    TaskStatuses,
    TaskType,
    updateTaskArgType,
    UpdateTaskModelType
} from "common/api/todolist-api";
import {appActions, RequestStatusType} from "app/appSlice";
import {handleServerAppError, handleServerNetworkError} from "common/utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistActions, todolistThunk} from "features/todolist/todolistSlice";
import {createAppAsyncThunk} from "common/utils/app-async-thunk";


export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriority
    startDate?: Date
    deadline?: Date
}

const getTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>(
    'tasks/getTasks',
    async (todolistId, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            const result = await TasksAPI.getTasks(todolistId)
            const tasks = result.data.items
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return {tasks, todolistId}
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(e)
        }
    }
)

const addTask = createAppAsyncThunk<{ todolistId: string, newTask: TaskType }, addTaskArgType>(
    'tasks/addTask', async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setStatus({status: 'loading'}))
            dispatch(todolistActions.setEntityStatus({todoListId: arg.todolistId, entityStatus: 'loading'}))
            const result = await TasksAPI.addTask(arg)
            if (result.data.resultCode === 0) {
                dispatch(todolistActions.setEntityStatus({todoListId: arg.todolistId, entityStatus: 'succeeded'}))
                dispatch(appActions.setStatus({status: 'succeeded'}))
                return {todolistId: arg.todolistId, newTask: result.data.data.item}

            } else {
                if (result.data.messages.length) {
                    dispatch(appActions.setError({error: result.data.messages[0]}))
                    dispatch(appActions.setStatus({status: 'failed'}))
                    dispatch(todolistActions.setEntityStatus({todoListId: arg.todolistId, entityStatus: 'failed'}))
                    return rejectWithValue(result)
                } else {
                    dispatch(appActions.setError({error: 'Some error occurred'}))
                    dispatch(appActions.setStatus({status: 'failed'}))
                    dispatch(todolistActions.setEntityStatus({todoListId: arg.todolistId, entityStatus: 'failed'}))
                    return rejectWithValue(result)
                }
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(e)
        }
    })

const updateTask = createAppAsyncThunk<updateTaskArgType<any>, updateTaskArgType<UpdateDomainTaskModelType>>(
    'tasks/updateTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue, getState} = thunkAPI
        try {
            const state = getState()
            const task = state.tasks[arg.todolistId].find((t: TasksType) => t.id === arg.taskId)

            if (!task) {
                console.warn('task not found in the state')
                return rejectWithValue(null)
            }
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: new Date(),
                deadline: new Date(),
                ...arg.model
            }
            const result = await TasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
            if (result.data.resultCode === 0) {
                return arg
            } else {
                handleServerAppError(result.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            return rejectWithValue(e)
        }
    })

const removeTask = createAppAsyncThunk<{ todolistId: string, taskId: string }, { todolistId: string, taskId: string }>('tasks/removeTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(taskActions.setEntityTaskStatus({
                todolistId: arg.todolistId,
                taskId: arg.taskId,
                status: 'loading'
            }))
            const result = await TasksAPI.deleteTask(arg.todolistId, arg.taskId)
            // dispatch(taskActions.RemoveTask({todoListId: arg.todolistId, taskId: arg.taskId}))
            dispatch(taskActions.setEntityTaskStatus({todolistId: arg.todolistId, taskId: arg.taskId, status: 'idle'}))
            return arg
        } catch (e) {
            console.log(e)
            return rejectWithValue(e)
        }
    })

export type TasksType = TaskType & { entityTaskStatus: string }

export type initialStateTaskType = {
    [key: string]: TasksType[]
}

const initialState: initialStateTaskType = {}


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setEntityTaskStatus: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) => {
            // return {...state, [action.payload.todolistId]: state[action.payload.todolistId].map(el => ({...el, entityTaskStatus: action.payload.status}))}
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t: TasksType) => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], entityTaskStatus: action.payload.status}
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistThunk.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistActions.RemoveTodolist, (state, action) => {
                delete state[action.payload.todolistId]
            })
            // .addCase(todolistThunk.getTodolist.fulfilled, (state, action) => {
            //
            //     // action.payload.todolists.map((el:any) => {
            //     //     return (dispatch(tasksThunks.getTasks(el.id)))
            //     // })
            //
            //
            // })
            .addCase(getTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks.map(el => ({
                    ...el,
                    entityTaskStatus: 'idle'
                }))
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                tasks.unshift({...action.payload.newTask, entityTaskStatus: 'idle'})
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((t: TasksType) => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((t: TasksType) => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
    }
})

export const taskReducer = slice.reducer
export const taskActions = slice.actions
export const tasksThunks = {getTasks, addTask, updateTask, removeTask}



