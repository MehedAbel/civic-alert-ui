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

            if (!response.ok) {
                if (response.status === 400) throw Error('Email or Password incorrect!');
                throw Error('Something went wrong with the responses!');
            }

            const data = await response.json();
            if (data) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('role', data.role);
                localStorage.setItem('email', data.email);

                setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
                setEmail(localStorage.getItem(data.email));
                setRole(localStorage.getItem('role'));

                if (role == 'admin') {
                    navigate('/admin-page');
                } else if (role == 'client') {
                    navigate('/client-page');
                } else if (role == 'official') {
                    navigate('/official-page');
                }

                return data;
            } else {
                throw Error('Something went wrong with the data received at login!');
            }

        } catch(error) {
            throw error;
        }
    }

    async function logout() {
        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
            if (!response.ok) {
                throw new Error('Logout Failed');
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('isAthenticated');
                localStorage.removeItem('role');
                localStorage.removeItem('email');
                setIsAuthenticated(false);
                setEmail(null);
                setRole(null);
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
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