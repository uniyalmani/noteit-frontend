// utils/navigation.js (or a suitable file for navigation helpers)
import { useNavigate } from 'react-router-dom';

 const navigateToLogin = (message: string) => {
    const navigate = useNavigate();
    navigate(`/signin?message=${encodeURIComponent(message)}`);
};


export default navigateToLogin