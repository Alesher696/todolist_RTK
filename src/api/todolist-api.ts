import axios from "axios";

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number

}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriority
    startDate: Date
    deadline: Date
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriority{
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriority
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type ResponseType<T> = {
    resultCode: number
    messages: string[]
    fieldsErrors: string[]
    data: T
}

export type LoginParamsType={
    email: string
    password: string
    rememberMe?: boolean
}

const Instanse = axios.create({
    withCredentials: true,
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    headers: {
        'API-KEY': '814d3cf1-9151-4829-ad9e-c7f2b77f0f6c'
    }
})

export const TodolistAPI = {
    getTodolist() {
        return Instanse.get<TodolistType[]>(`todo-lists`).then(res=> res.data)
    },
    addTodolist(title: string) {
        return Instanse.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return Instanse.delete<ResponseType<{}>>(`todo-lists/${todolistId}`)
    },
    updateTodoList(todolistId: string, title: string) {
        return Instanse.put<ResponseType<{}>>(`todo-lists/${todolistId}`, {title})
    }
}

export const TasksAPI = {
    getTasks(todolistId: string) {
        return Instanse.get(`todo-lists/${todolistId}/tasks`)
    },
    addTask(todolistId: string, title: string) {
        return Instanse.post(`todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, status: UpdateTaskModelType){
      return Instanse.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, status)
    },
    deleteTask(todolistId: string, taskId: string) {
        return Instanse.delete(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export const AuthAPI = {
    me(){
        return Instanse.get<ResponseType<{ id: number, login: string, email:string}>>('auth/me').then(res => res)
    },
    AuthLogin(data:LoginParamsType){
        return Instanse.post<ResponseType<{ userId: number}>>('auth/login', data)
    },
    logout(){
        return Instanse.delete('auth/login')
    }
}