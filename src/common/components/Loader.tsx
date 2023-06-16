import React from 'react';
import loader from 'common/assets/audio.svg'
import 'app/App.css'
export const Loader = () => {
    return (
        <div className={'loader'}>
            <img src={loader}/>
        </div>
    );
};

