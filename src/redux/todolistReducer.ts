import {ActionsType, AppDispatch, AppThunk} from "./store";
import {TodolistAPI, TodolistType} from "../api/todolist-api";
import {getTasksTC} from "./tasksReducer";
import {RequestStatusType, setStatusAC} from "./appReducer";
import {Dispatch} from "redux";

export type todolistsActionType = RemoveTodolistACType | AddTodolistACType
    | ChangeTodolistTitleACType | ChangeTodolistFilterACType
    | getTodolistsACType | setEntityStatusACType

export type initialStateTodolistType = TodolistType & { filter: string, entityStatus: RequestStatusType }

const initialState: initialStateTodolistType[] = [
    // {id: todolistId1, title: "What to learn", filter: 'all', entityStatus: RequestStatusType },
    // {id: todolistId2, title: "What to buy", filter: 'all'}
]

export const todolistReducer = (state: initialStateTodolistType[] = initialState, action: ActionsType): initialStateTodolistType[] => {
    switch (action.type) {
        case 'SET-ENTITY-STATUS':
            return state.map(el=> el.id === action.todoListId ? {...el, entityStatus: action.entityStatus}: el)
        case "GET-TODOS":
            return action.payload.todos.map((el) => ({...el, filter: 'all', entityStatus: 'idle'}))
        case 'REMOVE-TODOLIST':
            return state.filter(el => el.id !== action.todolistId)
        case 'ADD-TODOLIST':
            const newTodo = {
                id: action.todolist.id,
                title: action.todolist.title,
                addedDate: action.todolist.addedDate,
                order: action.todolist.order,
                filter: 'all',
                entityStatus: 'idle' as RequestStatusType
            }
            return [newTodo, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return [...state.map(el => el.id === action.id ? {...el, title: action.title} : el)]
        case 'CHANGE-TODOLIST-FILTER':
            return [...state.map(el => el.id === action.id ? {...el, filter: action.newFilter} : el)]
        default:
            return state
    }
}
export type RemoveTodolistACType = ReturnType<typeof RemoveTodolistAC>
export const RemoveTodolistAC = (todolistId: string) => {
    return {type: 'REMOVE-TODOLIST', todolistId: todolistId} as const
}

export type AddTodolistACType = ReturnType<typeof AddTodolistAC>
export const AddTodolistAC = (todolist: TodolistType) => {
    return {type: 'ADD-TODOLIST', todolist} as const
}

export type ChangeTodolistTitleACType = ReturnType<typeof ChangeTodolistTitleAC>
export const ChangeTodolistTitleAC = (todolistId: string, title: string) => {
    return {type: 'CHANGE-TODOLIST-TITLE', title: title, id: todolistId} as const
}

export type ChangeTodolistFilterACType = ReturnType<typeof ChangeTodolistFilterAC>
export const ChangeTodolistFilterAC = (todolistId: string, newFilter: string) => {
    return {type: 'CHANGE-TODOLIST-FILTER', newFilter: newFilter, id: todolistId} as const
}

export type getTodolistsACType = ReturnType<typeof getTodoListsAC>
const getTodoListsAC = (todos: TodolistType[]) => {
    return {type: "GET-TODOS", payload: {todos}} as const
}

export type setEntityStatusACType = ReturnType<typeof setEntityStatusAC>
export const setEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType )=>{
    return{
        type:'SET-ENTITY-STATUS',
        entityStatus,
        todoListId
    } as const
}

export const GetTodolistTC = (): AppThunk => async (dispatch: AppDispatch) => {
    try {
        dispatch(setStatusAC('loading'))
        const result = await TodolistAPI.getTodolist()
        dispatch(getTodoListsAC(result))
        result.map(el => {
            return (dispatch(getTasksTC(el.id)))
        })
    } catch (e) {
        console.log(e)
    }
}


//     dispatch(setStatusAC('loading'))
//     TodolistAPI.getTodolist()
//         .then(res =>  dispatch(getTodoListsAC(res))
//         )
//         .then(res => res.payload.todos.map(el => {
//                 return dispatch(getTasksTC(el.id))
//             })
//         )
//         .then(res => dispatch(setStatusAC('succeeded')))
// }


export const AddTodolistTC = (title: string):AppThunk => async (dispatch: Dispatch<ActionsType>) => {
    try {
        dispatch(setStatusAC('loading'))
        const result = await TodolistAPI.addTodolist(title)
        dispatch(AddTodolistAC(result.data.data.item))
        dispatch(setStatusAC('succeeded'))
    } catch (e) {
        console.log(e)
    }
}

export const DeleteTodolistTC = (todolistId: string):AppThunk => async (dispatch) => {
    try {
        dispatch(setEntityStatusAC(todolistId,'loading'))
        const result = await TodolistAPI.deleteTodolist(todolistId)
        dispatch(RemoveTodolistAC(todolistId))
    } catch (e) {
        console.log(e)
    }
}

export const UpdateTodoListTC = (todolistId: string, title: string):AppThunk => (dispatch) => {
    TodolistAPI.updateTodoList(todolistId, title)
        .then(res => dispatch(ChangeTodolistTitleAC(todolistId, title)))
        .catch(e => console.log(e))
}