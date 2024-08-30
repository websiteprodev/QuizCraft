import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    query,
    orderBy,
    limit,
    updateDoc,  
} from 'firebase/firestore';
import { db } from '@/configs/firebase';

export const fetchQuizzes = async () => {
    try {
        const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
        return quizzesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        throw error;
    }
};

export const fetchQuizById = async (id) => {
    try {
        const quizDoc = await getDoc(doc(db, 'quizzes', id));
        if (quizDoc.exists()) {
            return quizDoc.data();
        } else {
            throw new Error('No such quiz!');
        }
    } catch (error) {
        console.error('Error fetching quiz:', error);
        throw error;
    }
};

export const recordQuizScore = async (quizId, username, score) => {
    try {
        const scoreRef = doc(db, 'quizzes', quizId, 'scores', username);
        await setDoc(scoreRef, { score, username }, { merge: true });
    } catch (error) {
        console.error('Error recording score:', error);
        throw error;
    }
};

export const fetchTopScores = async (quizId) => {
    try {
        const scoresCollectionRef = collection(db, `quizzes/${quizId}/scores`);
        const scoresQuery = query(
            scoresCollectionRef,
            orderBy('score', 'desc'),
            limit(10),
        );
        const querySnapshot = await getDocs(scoresQuery);

        const scores = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return scores;
    } catch (error) {
        console.error('Error fetching top scores:', error);
        return [];
    }
};



export const updateQuiz = async (id, updatedData) => {
    try {
        const quizRef = doc(db, 'quizzes', id);
        await updateDoc(quizRef, updatedData);
    } catch (error) {
        console.error('Error updating quiz:', error);
        throw error;
    }
};
