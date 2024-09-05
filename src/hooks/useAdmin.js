import { useContext } from 'react';
import { AuthContext } from '@/pages/auth/authContext';

export function useAdmin() {
    const { currentUser } = useContext(AuthContext);
    return currentUser?.isAdmin || false;
}
