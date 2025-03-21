import { useState } from 'react'
import './App.css'

import { useAuth } from './context/AuthContext.jsx'
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Auth/Login/Login.jsx'
import Register from './components/Auth/Register/Register.jsx'
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword.jsx';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';

import ClientHome from './components/Client/Home/Home.jsx'
import ClientReports from './components/Client/Reports/Reports.jsx';

function App() {
    const { isAuthenticated, role } = useAuth();

    const getRootRedirectPath = (isAuthenticated, role) => {
        if (isAuthenticated) {
            if (role === 'CLIENT') {
                return '/client/home';
            } else if (role === 'ADMIN') {
                return '/admin-page';
            } else if (role === 'OFFICIAL') {
                return '/official-page';
            }
        }
        return '/login';
    }

    return (
        <div className='app-container'>
            <Routes>
            	{/* AUTH ROUTES */}
				<Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <Login />}></Route>
                
				<Route path='/register' element={isAuthenticated ? <Navigate to="/" /> : <Register />}></Route>
				<Route path='/forgot-password' element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />}></Route>

            	{/* ROOT ROUTE */}
            	<Route path='/' element={<Navigate to={getRootRedirectPath(isAuthenticated, role)} />}></Route>

				{/* CLIENT ROUTES */}
				<Route path='/client' element={<ProtectedRoute allowedRoles={['CLIENT', 'ADMIN', 'OFFICIAL']} />}>
					<Route path='home' element={<ClientHome />} />
                    <Route path='reports' element={<ClientReports />} />
				</Route>
              
				{/* ADMIN ROUTES */}
				<Route path='/admin' element={<ProtectedRoute allowedRoles={['ADMIN']} />}>

				</Route>

				{/* OFFICIAL ROUTES */}
				<Route path='/official' element={<ProtectedRoute allowedRoles={['OFFICIAL']} />}>
				
				</Route>
            </Routes>
        </div>
    )
}

export default App
