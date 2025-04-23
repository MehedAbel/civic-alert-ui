import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { API_URL } from '../../../config';

import Navbar from '../Navbar/Navbar.jsx';

const Reports = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    const [reports, setReports] = useState([]);

    const fetchUserReports = async () => {
        try {
            const response = await fetch(`${API_URL}/api/report/all-by-username/${email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw Error('Failed to fetch reports');
            }

            const data = await response.json();

            console.log("this is reports page");
            console.log(data);
            setReports(data);
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchUserReports();
    }, []);

    return (
        <div className='h-screen flex flex-col'>
            <Navbar /> 
            <div className='h-full bg-blue-100 relative'>
                
            </div>
        </div>
    );
}

export default Reports;