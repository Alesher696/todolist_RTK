import { removeTaskTC, updateTaskTC} from "../redux/tasksReducer";
import {TasksPropsType} from "../Tasks";

import {useAppDispatch} from "./hooks";
import {TaskStatuses} from "../api/todolist-api";

export const useTask = (props: TasksPropsType)=>{

    const dispatch = useAppDispatch()

    const changeTaskStatus = (todolistId: string, taskId: string, status:TaskStatuses) => {
        dispatch(updateTaskTC(todolistId, taskId, {status:status}))
    }

    const changeTaskTitle = (newTitle: string, taskId: string) => {
        dispatch(updateTaskTC(props.todolistId, taskId, {title:newTitle}))
    }

    const removeTask = (taskId:string) => {
        dispatch(removeTaskTC(props.todolistId, taskId))
    }

    return{
        changeTaskStatus,
        changeTaskTitle,
        removeTask
    }
}