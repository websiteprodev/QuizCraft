
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

export const updateUserQuizzesTaken = async (userId, quizId, points) => {
    const quizRef = doc(db, 'quizzes', quizId); 
    const quizSnap = await getDoc(quizRef);

    if (quizSnap.exists()) {
        const quizData = quizSnap.data();

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const quizzesTaken = userData.quizzesTaken || [];

            const existingQuizIndex = quizzesTaken.findIndex(quiz => quiz.quizId === quizId);

            if (existingQuizIndex !== -1) {
                const updatedQuizzesTaken = [...quizzesTaken];
                updatedQuizzesTaken[existingQuizIndex].points = points;

                await updateDoc(userRef, {
                    quizzesTaken: updatedQuizzesTaken,
                });
                console.log(`Updated points for quiz ID ${quizId} with title ${quizData.title} to ${points} for user ${userId}`);
            } else {
                await updateDoc(userRef, {
                    quizzesTaken: arrayUnion({
                        quizId: quizId,
                        title: quizData.title, 
                        points: points,
                    })
                });
                console.log(`Quiz ID ${quizId} with title ${quizData.title} and points ${points} added to quizzesTaken for user ${userId}`);
            }
        } else {
            console.error(`User with ID ${userId} not found`);
        }
    } else {
        console.error(`Quiz with ID ${quizId} not found`);
    }
};