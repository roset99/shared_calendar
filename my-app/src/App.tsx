import React from 'react';
import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';

import MonthlyCalendar from './components/MonthlyCalendar';
import SignUp from './components/Signup';
import Login from "./components/Login"
import Events from './components/Events';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/month-calendar" element={<MonthlyCalendar />} />
          <Route path="/signup" element={<SignUp/>} />  
          <Route path="/login" element={<Login/>} />   
          <Route path="/events" element={<Events/>} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
