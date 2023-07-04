import React, {useEffect} from 'react';
import {NavBar} from "common/components/NavBar";
import {LoadingBar} from "common/components/LoadingBar";
import {AddItem} from "common/components/AddItem";
import {Todolist} from "features/todolist/Todolist";
import {ErrorBar} from "common/components/ErrorBar";
import {useAppDispatch, useAppSelector} from "common/hooks/hooks";
import {appSelector, authSelector, TodolistSelector} from "common/utils/selectors";
import {todolistThunk} from "features/todolist/todolistSlice";
import 'app/App.css'
import {Navigate, Outlet} from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {getBackGroundURLTC} from "app/appSlice";


type LayOutProps = {

}

export const LayOut = (props: LayOutProps) => {

    const todolists = useAppSelector(TodolistSelector)
    const app = useAppSelector(appSelector)
    const auth = useAppSelector(authSelector)
    const dispatch = useAppDispatch()

    const addTodolist = (title: string) => {
        dispatch(todolistThunk.addTodolist(title))
    }

    useEffect(() => {
        if (!auth.isLoggedIn) {
            return
        }
        dispatch(todolistThunk.getTodolist())
        dispatch(getBackGroundURLTC())
    }, [])

    if (!auth.isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return (
        <div className={'app'} style={{backgroundImage: `url(${app.BackgroundURL})`}}>
            {/*<Loader/>*/}
            <NavBar/>
            <br/>
            <br/>
            <br/>
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

function hello(){
    console.log('hello')
    test()
}
function test() {
    console.log('test')
}