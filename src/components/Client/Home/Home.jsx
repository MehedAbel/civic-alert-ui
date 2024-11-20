import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

const Home = () => {
    const { isAuthenticated, role, email, logout } = useAuth();

    return (
        <div>
            <h2>Welcome Home, Clint Eastwood!</h2>
            <p>Role: {role}</p>
            <p>Email: {email}</p>   
            <p>Is Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
            <button onClick={logout} className='bg-ocean-200 hover:bg-ocean-300 text-white p-2 rounded-md font-semibold mt-2'>Logout</button>
        </div>
    );
}

export default Home;