// AuthProvider.tsx
import React, { createContext, useState, useEffect, FC } from 'react';
import Cookies from 'js-cookie';

interface AuthContextData {
    isLoggedIn: boolean;
    email?: string; // Maybe store user email for convenience
    accessToken?: string;
    refreshToken?: string;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>; // New function
  }
  

  const AuthContext = createContext<AuthContextData>({
    isLoggedIn: false,
    login: async () => {},
    signup: async () => {},
    logout: () => {},
    refreshAccessToken: async () => {} // Placeholder 
});


const AuthProvider: FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined);

  const login = async (email: string, password: string) => {
    try {
        console.log("inside the login function");
        const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                const { access, refresh } = data.data;
                setAccessToken(access);
                setRefreshToken(refresh)
                setIsLoggedIn(true);
                Cookies.set('accessToken', access);
                Cookies.set('refreshToken', refresh);
            } else {
                // Handle error case when 'success' is false
                throw new Error(data.message || 'Login failed.'); 
            }
        } else {
            if (response.status === 400) { // Assuming 400 for validation errors
                const errorData = await response.json(); 
                throw new Error(errorData.message); 
            } else {
                throw new Error('Login failed. Please check your credentials.'); 
            }
        }
    } catch (error) {
        if (error instanceof Error) { 
            if (error.name === 'AbortError') { 
                throw new Error('Could not connect to the server. Please check your network connection.');
            } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') { 
                throw new Error('Could not connect to the backend server. Please make sure it is running.'); 
            } else {
                throw error; // Re-throw other errors
            }
        } else {
            throw new Error('An unknown error occurred.'); 
        }
    }
};

  

  const signup = async (name: string, email: string, password: string) => {
    try {
        console.log("inside the login function");
        const response = await fetch('http://127.0.0.1:8000/api/auth/signup/', {
            method: 'POST',
            body: JSON.stringify({name, email, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();

            if (data.success) {
                const { access, refresh } = data.data;
                setAccessToken(access);
                setRefreshToken(refresh)
                setIsLoggedIn(true);
                Cookies.set('accessToken', access);
                Cookies.set('refreshToken', refresh);
            } else {
                // Handle error case when 'success' is false
                throw new Error(data.message || 'Login failed.'); 
            }
        } else {
            if (response.status === 400) { // Assuming 400 for validation errors
                const errorData = await response.json(); 
                throw new Error(errorData.message); 
            } else {
                throw new Error('Login failed. Please check your credentials.'); 
            }
        }
    } catch (error) {
        if (error instanceof Error) { 
            if (error.name === 'AbortError') { 
                throw new Error('Could not connect to the server. Please check your network connection.');
            } else if (error.name === 'TypeError' && error.message === 'Failed to fetch') { 
                throw new Error('Could not connect to the backend server. Please make sure it is running.'); 
            } else {
                throw error; // Re-throw other errors
            }
        } else {
            throw new Error('An unknown error occurred.'); 
        }
    }
};

  const logout = () => {
    setAccessToken(undefined);
    setRefreshToken(undefined);
    setIsLoggedIn(false);
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken'); // Remove refresh token on logout
};

const refreshAccessToken = async () => {
    try {
        if (!refreshToken) {
            throw new Error('No refresh token available.');
        }

        const response = await fetch('http://127.0.0.1:8000/api/auth/refresh-token/', {
            method: 'POST',
            body: JSON.stringify({ refresh_token: refreshToken }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json(); 
            if (data.success) {
                const { access } = data.data; 
                setAccessToken(access);
                Cookies.set('accessToken', access); 
            } else {
                throw new Error(data.message || 'Failed to refresh token');
            }
        } else {
            throw new Error('Network error while refreshing token.');
        }
    } catch (error) {
        console.error('Error refreshing access token:', error); 
        // Consider forcing logout or other actions if token refresh fails
    }
};

useEffect(() => {
    // ... Your existing useEffect logic ...
}, []);

return (
    <AuthContext.Provider value={{ isLoggedIn, accessToken, refreshToken, login, signup, logout, refreshAccessToken }}>
        {children}
    </AuthContext.Provider>
);
};

export { AuthContext, AuthProvider };