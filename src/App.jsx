import { useState } from 'react'
import './App.css'

import { useAuth } from './context/AuthContext.jsx'
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Auth/Login/Login.jsx'
import Register from './components/Auth/Register/Register.jsx'
import CompleteRegister from './components/Auth/Register/CompleteRegister.jsx';

function App() {
  return (
    <div className='app-container'>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/complete-register' element={<CompleteRegister />}></Route>
      </Routes>
    </div>
  )
}

export default App
