import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

export const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') == 'true');
    const [email, setEmail] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('isAuthenticated') == 'true');
        setEmail(localStorage.getItem('email'));
        setRole(localStorage.getItem('role'));
    }, []);

    async function login(email, password) {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            if (response.status !== 200) {
                if (response.status === 400) throw Error('Email or Password incorrect!');
                throw Error('Response status not ok!');
            }

            const data = await response.json();
            if (data) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('role', data.userType);
                localStorage.setItem('email', data.email);

                setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
                setEmail(localStorage.getItem('email'));
                setRole(localStorage.getItem('role'));

                navigate('/');

                return data;
            } else {
                throw Error('No data received!');
            }

        } catch(error) {
            throw error;
        }
    }

    async function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
        setEmail(null);
        setRole(null);
        navigate('/login');
    }

    // async function fetchWithAuth(url, options = {}) {
    //     let response = await fetch(url, { ...options, credentials: 'include' });
    //     if (response.status === 401) {
    //         const refreshed = await refreshToken();
    //         if (refreshed) {
    //             response = await fetch(url, { ...options, credentials: 'include' });
    //         }
    //     }
    //     return response;
    // }

    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated, setIsAuthenticated, role, setRole, email, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
};