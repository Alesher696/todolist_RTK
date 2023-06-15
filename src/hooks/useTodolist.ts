import {addTaskTC} from "redux/tasksSlice";
import {AddTodolistTC, DeleteTodolistTC, todolistActions, UpdateTodoListTC} from "redux/todolistSlice";
import {useAppDispatch} from "./hooks";


export const useTodolist =(id: string, title: string, filter: string)=>{

    const dispatch = useAppDispatch()

    const addTodolist = (title: string) => {
        dispatch(AddTodolistTC(title))
    }

    const addTask = (title: string) => {
        dispatch(addTaskTC(id, title))
    }

    const removeTodoList = () => {
        dispatch(DeleteTodolistTC(id))
    }

    const changeFilter = (filter: string) => {
        dispatch(todolistActions.ChangeTodolistFilter({todolistId: id, newFilter: filter }))
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