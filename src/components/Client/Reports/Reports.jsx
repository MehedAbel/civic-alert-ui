import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

import Navbar from '../Navbar/Navbar.jsx';

const Reports = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    return (
        <div className='h-screen'>
            <Navbar /> 
            <div className='h-full bg-blue-100 relative'>
                
            </div>
        </div>
    );
}

export default Reports;