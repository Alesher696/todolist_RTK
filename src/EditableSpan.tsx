import React, {ChangeEvent, useState} from 'react';


type EditableSpanProps = {
    title: string
    changeTitle: (newTitle: string, id: string) => void
    id: string
}
export const EditableSpan = (props: EditableSpanProps) => {

    const [redactMode, setRedactMove] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)

    const changeRedactMode = () => {
        setRedactMove(!redactMode)
    }

    const onchangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }
    const onClickHandler = () => {
        props.changeTitle(newTitle, props.id)
        changeRedactMode()
    }
    if (!redactMode) {
        return <span onDoubleClick={changeRedactMode}>{props.title}</span>
    } else
        return (
            <span>
                <input value={newTitle} onChange={onchangeHandler} autoFocus onBlur={onClickHandler}/>
                <button onClick={onClickHandler}>save</button>
            </span>
        );
};

