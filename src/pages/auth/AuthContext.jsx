import React, { useContext, useState, useEffect, createContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
    getDoc,
    doc,
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '@/configs/firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const usersCollectionRef = collection(db, 'users');
                    const userQuery = query(
                        usersCollectionRef,
                        where('uid', '==', firebaseUser.uid),
                    );
                    const querySnapshot = await getDocs(userQuery);

                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const username = userDoc.id;
                        const userData = userDoc.data();
                        setUser({ ...userData, username });
                    } else {
                        console.error('No user document found for this UID');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error.message);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = { user, setUser };

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
