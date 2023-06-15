import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useAppDispatch, useAppSelector} from "hooks/hooks";
import {loginTC} from "redux/authSlice";
import {LoadingBar} from "./LoadingBar";
import {appSelector, authSelector} from "redux/selectors";
import {Navigate} from "react-router-dom";
import {ErrorBar} from "./ErrorBar";
import '../App.css'
import {SubmitHandler, useForm} from "react-hook-form";


type LoginFormInputs  = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {
    const app = useAppSelector(appSelector)
    const auth = useAppSelector(authSelector)
    const dispatch = useAppDispatch()


    const { register, handleSubmit, watch, formState: { errors }} = useForm<LoginFormInputs>();

    const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
        dispatch(loginTC(data))
    };


    if (auth.isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'} className={'login'}>
        {app.status === "loading" && <LoadingBar/>}
        <Grid item justifyContent={'center'} alignItems={'center'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField label="Email"
                                   margin="normal"
                                   {...register('email', {
                                       required: true,
                                       pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
                                   })}
                        />
                        {errors.email && errors.email.type === 'required' && <div>Required</div>}
                        {errors.email && errors.email.type === 'pattern' && <div>Invalid email address</div>}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   {...register('password', {
                                       required: true,
                                       minLength: 4
                                   })}
                        />
                        {errors.password && errors.password.type === 'required' && <div>Required</div>}
                        {errors.password && errors.password.type === 'minLength' && <div>Password is invalid</div>}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox  {...register('rememberMe')}/>}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>
                           Log In
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
            <ErrorBar/>
        </Grid>
    </Grid>
}