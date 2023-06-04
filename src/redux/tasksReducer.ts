import {Dispatch} from "redux";
import {TaskPriority, TasksAPI, TaskStatuses, TaskType, UpdateTaskModelType} from "../api/todolist-api";
import {ActionsType, storeType} from "./store";
import {RequestStatusType, setErrorAC, setStatusAC} from "./appReducer";
import {handleServerAppError} from "../utils/error-utils";
import {AddTodolistACType, RemoveTodolistACType, setEntityStatusAC, setEntityStatusACType} from "./todolistReducer";


export type tasksActionType = AddTaskACType | RemoveTaskACType | UpdateTaskACType |
    getTasksACType | setEntityStatusACType | setEntityTaskStatusACType |
    AddTodolistACType | RemoveTodolistACType


type TasksType = TaskType & { entityTaskStatus: string }

export type initialStateTaskType = {
    [key: string]: TasksType[]
}


const initialState = {}

export const tasksReducer = (state: initialStateTaskType = initialState, action: tasksActionType): initialStateTaskType => {
    switch (action.type) {
        case "GET-TASKS": {
            return {...state, [action.todolistId]: action.tasks.map(el => ({...el, entityTaskStatus: 'idle'}))}
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'ADD-TASK': {
            return {
                ...state,
                [action.todolistId]: [{...action.newTask, entityTaskStatus: 'idle'}, ...state[action.todolistId]]
            }
        }
        case'REMOVE-TASK': {
            return {...state, [action.todoListId]: state[action.todoListId].filter(el => el.id !== action.taskId)}
        }
        case 'SET-TASK-STATUS': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => ({...el, entityTaskStatus: action.status}))
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state}
            delete copyState[action.todolistId]
            return copyState
        }
        default:
            return state
    }
}

export type AddTaskACType = ReturnType<typeof AddTaskAC>
export const AddTaskAC = (todolistId: string, newTask: TasksType) => {
    return {
        type: 'ADD-TASK',
        newTask,
        todolistId
    } as const
}

export type RemoveTaskACType = ReturnType<typeof RemoveTaskAC>
export const RemoveTaskAC = (todoListId: string, taskId: string) => {
    return {
        type: 'REMOVE-TASK',
        todoListId,
        taskId
    } as const
}

export type UpdateTaskACType = ReturnType<typeof UpdateTaskAC>
const UpdateTaskAC = (todoListId: string, taskId: string, model: any) => {
    return {
        type: 'UPDATE-TASK',
        todoListId,
        taskId,
        model
    } as const
}

export type getTasksACType = ReturnType<typeof getTasksAC>
const getTasksAC = (todolistId: string, tasks: TaskType[]) => {
    return {
        type: 'GET-TASKS',
        todolistId,
        tasks
    } as const

}

export type setEntityTaskStatusACType = ReturnType<typeof setEntityTaskStatusAC>
const setEntityTaskStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => {
    return {
        type: 'SET-TASK-STATUS',
        todolistId,
        taskId,
        status
    } as const
}

export const getTasksTC = (todolistId: string) => async (dispatch: Dispatch<ActionsType>) => {
    try {
        const result = await TasksAPI.getTasks(todolistId)
        dispatch(getTasksAC(todolistId, result.data.items))
        dispatch(setStatusAC('succeeded'))
    } catch (e) {
        console.log(e)
    }
}

export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch<ActionsType>) => {

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

    dispatch(setStatusAC('loading'))
    dispatch(setEntityStatusAC(todolistId, 'loading'))
    const result = await TasksAPI.addTask(todolistId, title)
    if (result.data.resultCode === 0) {
        dispatch(AddTaskAC(todolistId, result.data.data.item))
        dispatch(setEntityStatusAC(todolistId, 'succeeded'))
        dispatch(setStatusAC('succeeded'))
    } else {
        if (result.data.messages.length) {
            dispatch(setErrorAC(result.data.messages[0]))
            dispatch(setStatusAC('failed'))
            dispatch(setEntityStatusAC(todolistId, 'failed'))

        } else {
            dispatch(setErrorAC('Some error occurred'))
            dispatch(setStatusAC('failed'))
            dispatch(setEntityStatusAC(todolistId, 'failed'))

        }
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setEntityTaskStatusAC(todolistId, taskId, 'loading'))
        const result = await TasksAPI.deleteTask(todolistId, taskId)
        dispatch(RemoveTaskAC(todolistId, taskId))
        dispatch(setEntityTaskStatusAC(todolistId, taskId, 'idle'))
    } catch (e) {
        console.log(e)
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => async (dispatch: Dispatch<ActionsType>, getState: () => storeType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)
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
        dispatch(UpdateTaskAC(todolistId, taskId, apiModel))
    } else {
        handleServerAppError(result.data, dispatch)
    }
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriority
    startDate?: Date
    deadline?: Date
}