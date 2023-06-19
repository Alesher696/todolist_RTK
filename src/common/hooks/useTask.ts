import {tasksThunks} from "features/tasks/tasksSlice";
import {TasksPropsType} from "features/tasks/Tasks";

import {useAppDispatch} from "common/hooks/hooks";
import {TaskStatuses} from "common/api/todolist-api";

export const useTask = (props: TasksPropsType)=>{

    const dispatch = useAppDispatch()

    const changeTaskStatus = (todolistId: string, taskId: string, status:TaskStatuses) => {
        dispatch(tasksThunks.updateTask({todolistId, taskId, model:{status:status}}))
    }

    const changeTaskTitle = (newTitle: string, taskId: string) => {
        dispatch(tasksThunks.updateTask({todolistId: props.todolistId, taskId, model:{title:newTitle}}))
    }

    const removeTask = (taskId:string) => {
        dispatch(tasksThunks.removeTask({todolistId: props.todolistId, taskId: taskId}))
    }

    return{
        changeTaskStatus,
        changeTaskTitle,
        removeTask
    }
}