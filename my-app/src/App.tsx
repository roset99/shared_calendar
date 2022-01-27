import React from 'react';
import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import SignUp from './components/Signup';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>} /> 
        <Route path="/signup" element={<SignUp/>} />     
      </Routes>
    </BrowserRouter>
  );
}

export default App;
