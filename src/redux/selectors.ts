import {storeType} from "./store";

export const TodolistSelector=(state:storeType) => state.todolist
export const TaskSelector=(state:storeType) => state.tasks
export const appSelector=(state:storeType) => state.app
export const authSelector = (state:storeType)=> state.auth