import {AddTodolistTC, DeleteTodolistTC, todolistActions, UpdateTodoListTC} from "features/todolist/todolistSlice";
import {useAppDispatch} from "common/hooks/hooks";
import {tasksThunks} from "features/tasks/tasksSlice";


export const useTodolist =(todolistId: string, title: string, filter: string)=>{

    const dispatch = useAppDispatch()

    const addTodolist = (title: string) => {
        dispatch(AddTodolistTC(title))
    }

    const addTask = (title: string) => {
        dispatch(tasksThunks.addTask({todolistId, title}))
    }

    const removeTodoList = () => {
        dispatch(DeleteTodolistTC(todolistId))
    }

    const changeFilter = (filter: string) => {
        dispatch(todolistActions.ChangeTodolistFilter({todolistId: todolistId, newFilter: filter }))
    }

    const changeTodoTitle=(title:string, id:string)=>{
        dispatch(UpdateTodoListTC(id,title))
    }
    return {
        addTodolist,
        addTask,
        removeTodoList,
        changeFilter,
        changeTodoTitle
    }
}