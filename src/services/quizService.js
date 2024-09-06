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
    where,
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

export const fetchQuizzesByStatus = async (status) => {
    try {
        const quizzesRef = collection(db, 'quizzes');
        const q = query(quizzesRef, where('status', '==', status));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching quizzes by status:', error);
        throw error;
    }
};

export const fetchUserRankAndPoints = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const { points, rank } = userData;

            const nextRankThreshold = calculateNextRankThreshold(rank);
            const progressToNextRank = (points / nextRankThreshold) * 100;

            return { points, rank, progressToNextRank };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user rank and points:', error);
        throw error;
    }
};
export const fetchUserRankAndProgress = async (uid) => {
    console.log(`Attempting to fetch rank for user ID: ${uid}`); 
    try {
        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            console.log(`No document found for user ID: ${uid}`);
            throw new Error("User not found");
        }

        const userData = userDoc.data();
        const rank = userData.rank || "Beginner";
        const points = userData.points || 0;
        const nextRankProgress = (points % 100) / 100 * 100;
        return {
            rank,
            points,
            nextRankProgress,
        };
    } catch (error) {
        console.error("Error fetching user rank and progress:", error);
        throw error;
    }
    
};


const calculateNextRankThreshold = (currentRank) => {
    const basePoints = 100;
    return basePoints + currentRank * 100;
};
