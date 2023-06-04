import React from 'react';
import {AddItem} from "../AddItem";


type SettingsProps = {
    setBackgroundImg: (url: string) => void
}
export const Settings = (props: SettingsProps) => {

    const setBackgroundImgHandler = (url: string) => {
        props.setBackgroundImg(url)

    }

    return <AddItem addItem={setBackgroundImgHandler} disabled={false}/>
};

