import React, {useEffect} from 'react';
import {Route, Routes} from "react-router-dom";
import {LayOut} from "common/components/LayOut";
import {Login} from "features/login/login";
import {useAppDispatch, useAppSelector} from "common/hooks/hooks";
import {Loader} from "common/components/Loader";
import {appThunks, setBackGroundURLTC} from "app/appSlice";
import {Settings} from "common/components/Settings";
import {appSelector} from "common/utils/selectors";


function App() {

    const dispatch = useAppDispatch()
    const app = useAppSelector(appSelector)

    const setBackgroundImg = (url: string) => {
      dispatch(setBackGroundURLTC(url))
    }

    useEffect(() => {
        dispatch(appThunks.initializedApp())

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


