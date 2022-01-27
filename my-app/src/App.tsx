import React from 'react';
import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import MonthlyCalendar from './components/MonthlyCalendar';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>}>
          <Route path="/month-calendar" element={<MonthlyCalendar/>}/>
        </Route>    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
