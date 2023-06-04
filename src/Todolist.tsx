import React from 'react';
import {AddItem} from "./AddItem";
import {initialStateTodolistType,} from "./redux/todolistReducer";
import {Tasks} from "./Tasks";
import {ButtonsFilter} from "./ButtonsFilter";
import {EditableSpan} from "./EditableSpan";
import {useTodolist} from "./hooks/useTodolist";
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { motion } from 'framer-motion';


export type TodolistProps = {
    todolist: initialStateTodolistType
    index: number
}

export const Todolist = ({todolist, ...restProps}: TodolistProps) => {

    const listVariants = {
        visible: (i: number) =>({
            opacity: 1,
            transform: 'translateX(-0px)',
            transition:{
                delay: i * 0.3
            }
        }),
        hidden:{
            opacity: 0,
            transform: 'translateX(-150px)',
            // transform: 'translateY(0)',
        },
    }

    const {id, title, filter, entityStatus} = todolist
    const {
        addTask,
        removeTodoList,
        changeFilter,
        changeTodoTitle
    } = useTodolist(id, title, filter)

    return (
        <motion.div  variants={listVariants}
                     initial='hidden'
                     animate='visible'
                     custom={restProps.index}
        >
            <Card sx={{minWidth: 275, m:2}}>
                <CardActions>
                    <EditableSpan title={title} changeTitle={changeTodoTitle} id={id}/>
                    <Button onClick={removeTodoList} disabled={entityStatus === 'loading'}
                            color={'primary'}><ClearIcon/></Button>
                </CardActions>
                <CardActions>
                    <AddItem addItem={addTask} disabled={entityStatus === 'loading'}/>
                </CardActions>
                <CardActions>
                    <Tasks todolistId={id} filter={filter}/>
                </CardActions>
                <CardActions>
                    <ButtonsFilter changeFilter={changeFilter} filter={filter}/>
                </CardActions>
            </Card>
        </motion.div>
    );
};

