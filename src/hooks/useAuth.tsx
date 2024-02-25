import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    const { login, signup, logout, refreshAccessToken } = useContext(AuthContext);
    return { login, signup, logout, refreshAccessToken };
  };