import React, {ChangeEvent} from 'react';
import {EditableSpan} from "./EditableSpan";
import {useTask} from "./hooks/useTask";
import {useAppSelector} from "./hooks/hooks";
import {TaskSelector} from "./redux/selectors";
import {TaskStatuses} from "./api/todolist-api";
import ClearIcon from '@mui/icons-material/Clear';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import {TransitionGroup, CSSTransition} from "react-transition-group";
import './App.css'


export type TasksPropsType = {
    todolistId: string
    filter: string
}

export const Tasks = (props: TasksPropsType) => {

    const {
        changeTaskTitle,
        changeTaskStatus,
        removeTask
    } = useTask(props)

    let tasks = useAppSelector(TaskSelector)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>, taskId: string) => {
        changeTaskStatus(props.todolistId, taskId, e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New)
    }

    let allTasks = tasks[props.todolistId];

    if (props.filter === 'active') {
       allTasks = tasks[props.todolistId].filter(el=> el.status === TaskStatuses.New)

    } if(props.filter === 'completed'){
        allTasks = tasks[props.todolistId].filter(el=> el.status === TaskStatuses.Completed)

    }

     let mappedTasks = allTasks?.map(t => (
            <CSSTransition key={t.id}
                           timeout={500}
                           classNames='item'>
                <div key={t.id}>
                    <Checkbox checked={!!t.status}
                              onChange={(e) => onChangeHandler(e, t.id)}/>
                    <EditableSpan title={t.title} id={t.id} changeTitle={changeTaskTitle}/>
                    <Button onClick={() => removeTask(t.id)} color={'primary'}
                    ><ClearIcon/></Button>
                </div>
            </CSSTransition>
        )
    )

    return (
        <div>
            <TransitionGroup>
                {mappedTasks}
            </TransitionGroup>
        </div>
    );
};

