import {storeType} from "app/store";


export const TodolistSelector=(state:storeType) => state.todolist
export const TaskSelector=(state:storeType) => state.tasks
export const appSelector=(state:storeType) => state.app
export const authSelector = (state:storeType)=> state.auth


//=======================================================================
// export const isInitialized = (state:storeType) => state.app.isInitialized