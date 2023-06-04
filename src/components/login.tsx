import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../hooks/hooks";
import {loginTC} from "../redux/authReduser";
import {LoadingBar} from "./LoadingBar";
import {appSelector, authSelector} from "../redux/selectors";
import {Navigate} from "react-router-dom";
import {ErrorBar} from "./ErrorBar";
import '../App.css'



type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export const Login = () => {
    const app = useAppSelector(appSelector)
    const auth = useAppSelector(authSelector)
    const dispatch = useAppDispatch()

    const formik = useFormik({

        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },

        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length <= 3) {
                errors.password = 'password is invalid'
            }
            return errors
        },
        onSubmit: values => {
            dispatch(loginTC(values))
        },
    })

    if (auth.isLoggedIn) {
        return <Navigate to={'/'}/>
    }

    return <Grid container justifyContent={'center'} className={'login'}>
        {app.status === "loading" && <LoadingBar/>}
        <Grid item justifyContent={'center'} alignItems={'center'}>
            <form onSubmit={formik.handleSubmit}>
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
                            // name='email'
                            // onChange={formik.handleChange}
                            // value={formik.values.email}
                            // onBlur={formik.handleBlur}
                                   {...formik.getFieldProps('email',)}
                        />
                        {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
                        <TextField type="password"
                                   label="Password"
                                   margin="normal"
                                   name='password'
                                   onChange={formik.handleChange}
                                   value={formik.values.password}
                                   onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
                        <FormControlLabel label={'Remember me'}
                                          control={<Checkbox checked={formik.values.rememberMe}
                                                             name={'rememberMe'}
                                                             onChange={formik.handleChange}/>}
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