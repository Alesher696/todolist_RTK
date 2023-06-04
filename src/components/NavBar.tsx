import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {NavLink, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/hooks";
import {authSelector} from "../redux/selectors";
import {logoutTC} from "../redux/authReduser";
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';

export const NavBar = () => {

    const [selected, setSelected] = React.useState(false);
    const navigate = useNavigate()

    const auth = useAppSelector(authSelector)
    const dispatch = useAppDispatch()
    const logoutHandler = () => {
        dispatch(logoutTC())
    }

    const onClickSettingsHandler = (selected: boolean) => {
        if(selected){
            navigate('/settings')
        }
        if(!selected){
            navigate('/')
        }
    }

    return (<div className={'NavBar'}>
            <Box>
                <AppBar position="fixed" color='inherit' sx={{top: 0}}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Hrenello
                        </Typography>
                        <ToggleButton
                            value="check"
                            selected={selected}
                            onChange={() => {
                                setSelected(!selected);
                            }}
                            onClick={() => onClickSettingsHandler(selected)}
                        >
                            <CheckIcon/>
                        </ToggleButton>
                        {auth.isLoggedIn ? <button onClick={logoutHandler}>log out</button> : ''}
                        <NavLink to={'/login'}><Button
                            color="inherit">{auth.isLoggedIn ? auth.login : 'Log In'}</Button></NavLink>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
};

