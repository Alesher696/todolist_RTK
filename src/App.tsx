import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import {LayOut} from "./components/LayOut";
import {Login} from "./components/login";
import {useAppDispatch, useAppSelector} from "./hooks/hooks";
import {appSelector} from "./redux/selectors";
import {Loader} from "./components/Loader";
import {initializeAppTC, setBackGroundURLTC} from "./redux/appReducer";
import {Settings} from "./components/Settings";


function App() {
    const dispatch = useAppDispatch()
    const app = useAppSelector(appSelector)

    const setBackgroundImg = (url: string) => {
      dispatch(setBackGroundURLTC(url))
    }

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])


  if(!app.isInitialized){
    return <Loader/>
  } else

  return (
      <Routes>
        <Route path={'/'} element={<LayOut/>}>
          <Route path={'/settings'} element={<Settings setBackgroundImg={setBackgroundImg}/>}></Route>
        </Route>
        <Route path={'/login'} element={<Login/>}></Route>
      </Routes>
  )
}

export default App;


