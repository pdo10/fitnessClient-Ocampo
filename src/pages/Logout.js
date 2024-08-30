import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {

    const { unsetUser, setUser } = useContext(UserContext);
    
    useEffect(() => {
        unsetUser()
        setUser({
            id: null,
            isAdmin: null
        });

    }, [])

    // Navigate back to login
    return (
        <Navigate to='/login' />
    )

}