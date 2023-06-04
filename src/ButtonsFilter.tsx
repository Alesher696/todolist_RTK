import React, {useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './App.css';



type ButtonsFilterPropsType = {
    changeFilter: (filter: string) => void
    filter: string
}

export const ButtonsFilter = (props: ButtonsFilterPropsType) => {

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        filter: string,
    ) => {
        props.changeFilter(filter)
        // setFilter(filter)
    };

    return (
            <ToggleButtonGroup
                className={'btnFilters'}
                color="primary"
                value={props.filter}
                exclusive
                onChange={handleChange}
            >
                <ToggleButton value="all" >all</ToggleButton>
                <ToggleButton value="active">active</ToggleButton>
                <ToggleButton value="completed">completed</ToggleButton>
            </ToggleButtonGroup>
    );
};

// className={props.filter === 'all'? 'buttonActive': ''}