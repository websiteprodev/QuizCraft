
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '@/configs/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
} from 'firebase/firestore';

const GroupContext = createContext();

export function GroupProvider({ children }) {
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null);

    useEffect(() => {
        const fetchGroups = async () => {
            const user = auth.currentUser;
            if (user) {
                const q = query(
                    collection(db, 'groups'),
                    where('members', 'array-contains', user.uid),
                );
                const querySnapshot = await getDocs(q);
                setGroups(
                    querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                );
            }
        };
        fetchGroups();
    }, [auth.currentUser]);

    const createGroup = async (name, description) => {
        const user = auth.currentUser;
        if (user) {
            const newGroupRef = doc(collection(db, 'groups'));
            await setDoc(newGroupRef, {
                name,
                description,
                members: [user.uid],
                createdBy: user.uid,
                quizzes: [],
            });
            setGroups([
                ...groups,
                {
                    id: newGroupRef.id,
                    name,
                    description,
                    members: [user.uid],
                    createdBy: user.uid,
                    quizzes: [],
                },
            ]);
        }
    };

    return (
        <GroupContext.Provider
            value={{ groups, currentGroup, setCurrentGroup, createGroup }}
        >
            {children}
        </GroupContext.Provider>
    );
}

export function useGroupContext() {
    return useContext(GroupContext);
}
