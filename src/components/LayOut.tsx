import React, {useEffect} from 'react';
import {NavBar} from "./NavBar";
import {LoadingBar} from "./LoadingBar";
import {AddItem} from "../AddItem";
import {Todolist} from "../Todolist";
import {ErrorBar} from "./ErrorBar";
import {useAppDispatch, useAppSelector} from "../hooks/hooks";
import {appSelector, authSelector, TodolistSelector} from "../redux/selectors";
import {AddTodolistTC, GetTodolistTC} from "../redux/todolistReducer";
import '../App.css'
import {Navigate, Outlet} from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getBackGroundURLTC} from "../redux/appReducer";

type LayOutProps = {}

export const LayOut = (props: LayOutProps) => {

    const todolists = useAppSelector(TodolistSelector)
    const app = useAppSelector(appSelector)
    const auth = useAppSelector(authSelector)
    const dispatch = useAppDispatch()

    const addTodolist = (title: string) => {
        dispatch(AddTodolistTC(title))
    }

    useEffect(() => {
        if (!auth.isLoggedIn) {
            return
        }
        dispatch(GetTodolistTC())
        dispatch(getBackGroundURLTC())
    }, [])

    
    if (!auth.isLoggedIn) {
        return <Navigate to={'/login'}/>
    }


    return (
        <div className={'app'} style={{backgroundImage: `url(${app.BackgroundURL})`}}>
            {/*<Loader/>*/}
            <NavBar/>
            {app.status === "loading" && <LoadingBar/>}
            <br/>
            <div className={'additionalApp'}>
                <br/>
                <div className={'inputs'}>
                    <Outlet/>
                    <br/>
                    <AddItem addItem={addTodolist} disabled={false}/>
                </div>
                <TransitionGroup className={'todolists'}>
                    {todolists.map((tl, index) => {
                        return (
                            <CSSTransition key={tl.id}
                                           timeout={500}
                                           classNames='todoStyle'
                            >
                                <Todolist key={tl.id} todolist={tl} index={index}/>
                            </CSSTransition>
                        )
                    })}
                </TransitionGroup>
            </div>
            <ErrorBar/>
        </div>
    );
};


