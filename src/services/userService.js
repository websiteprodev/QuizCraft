
import { collection, getDocs, query, orderBy, limit, startAfter, getDoc, doc, updateDoc,arrayUnion } from 'firebase/firestore';
import { db } from '@/configs/firebase';

export const fetchUsersPaginated = async (lastVisibleDoc) => {
    try {
        let usersQuery = query(
            collection(db, 'users'),
            orderBy('username'),
            limit(10)
        );

        if (lastVisibleDoc) {
            usersQuery = query(usersQuery, startAfter(lastVisibleDoc));
        }

        const usersSnapshot = await getDocs(usersQuery);
        const lastVisible = usersSnapshot.docs[usersSnapshot.docs.length - 1];
        const data = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return { data, lastVisibleDoc: lastVisible };
    } catch (error) {
        console.error('Error fetching paginated users:', error);
        throw error;
    }
};
export const updateUserQuizzesTaken = async (userId, quizId) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        await updateDoc(userRef, {
            quizzesTaken: arrayUnion(quizId), 
        });
        console.log(`Quiz ID ${quizId} added to quizzesTaken for user ${userId}`);
    } else {
        console.error(`User with ID ${userId} not found`);
    }
};