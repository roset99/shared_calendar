import React, { useEffect, useState } from 'react';
import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import MonthlyCalendar from './components/MonthlyCalendar';
import SignUp from './components/Signup';
import Login from "./components/Login"
import Events from './components/Events';
import DailyCalendar from './components/DailyCalendar';
import CreatePerson from './components/CreatePerson';

function App() {

  const [currentFamily, setCurrentFamily] = useState(getSessionStorageOrDefault("currentFamily", null));

  useEffect(() => {
    sessionStorage.setItem("currentFamily", JSON.stringify(currentFamily));
  }, [currentFamily]);

  function getSessionStorageOrDefault(key: string, defaultValue: null) {
    const stored = sessionStorage.getItem(key);

    if (!stored) {
      return defaultValue;
    }

    return JSON.parse(stored);
  }

  const onLoginSetFamily = (family: any) : void => { 
    setCurrentFamily(family);
  }

  return (
    <BrowserRouter>
      <Routes>
          {(currentFamily) ? 
          <>
          <Route path="/month-calendar" element={<MonthlyCalendar currentFamily={currentFamily}/>} />
          <Route path="/members" element={<CreatePerson currentFamily={currentFamily} />} />
          <Route path="/days" element={<DailyCalendar/>} /> 
          </>
          :
          <>
          <Route path="/login" element={<Login onLoginSetFamily={onLoginSetFamily}/>} /> 
          <Route path="/signup" element={<SignUp onLoginSetFamily={onLoginSetFamily}/>} />  
          </>
          }
          <Route path="/" element={<Homepage currentFamily={currentFamily}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
