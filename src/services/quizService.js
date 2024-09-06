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
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    return quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const fetchQuizById = async (id) => {
    const quizDoc = await getDoc(doc(db, 'quizzes', id));
    if (quizDoc.exists()) {
        return quizDoc.data();
    } else {
        throw new Error('No such quiz!');
    }
};
const updateUserRankAndPoints = async (userId, pointsToAdd) => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedPoints = (userData.points || 0) + pointsToAdd;
        const nextRankThreshold = calculateNextRankThreshold(userData.rank || 0);
        if (updatedPoints >= nextRankThreshold) {
            // Here you would define how rank updates if threshold is crossed
            await updateDoc(userRef, {
                points: updatedPoints,
                rank: (userData.rank || 0) + 1, // Increment rank
            });
        } else {
            await updateDoc(userRef, {
                points: updatedPoints
            });
        }
    } else {
        console.error("User not found");
    }
};

export const recordQuizScore = async (quizId, userId, score) => {
    try {
        // Record the individual quiz score
        const scoreRef = doc(db, 'quizzes', quizId, 'scores', userId);
        await setDoc(scoreRef, { score, userId }, { merge: true });

        // Update the user's total points and rank
        await updateUserRankAndPoints(userId, score);
    } catch (error) {
        console.error('Error recording score and updating user info:', error);
    }
};

export const fetchTopScores = async (quizId) => {
    try {
        const scoresCollectionRef = collection(db, `quizzes/${quizId}/scores`);
        const scoresQuery = query(scoresCollectionRef, orderBy('score', 'desc'), limit(10));
        const querySnapshot = await getDocs(scoresQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
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
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching quizzes by status:', error);
        throw error;
    }
};

export const fetchUserRankAndPoints = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const nextRankThreshold = calculateNextRankThreshold(userData.rank);
            const progressToNextRank = (userData.points / nextRankThreshold) * 100;
            return { points: userData.points, rank: userData.rank, progressToNextRank };
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user rank and points:', error);
        throw error;
    }
};
export const fetchUserRankAndProgress = async (username) => {
    console.log(`Attempting to fetch rank for user username: ${username}`);
    try {
        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            console.log(`No document found for user username: ${username}`);
            return { error: "User not found", username };
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



export const fetchUsersData = async () => {
    try {
        const usersCollectionRef = collection(db, "users");
        const querySnapshot = await getDocs(usersCollectionRef);
        console.log(querySnapshot.docs.map(doc => doc.data()));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const fetchUsersWithScores = async () => {
    const usersRef = collection(db, "users");
    const scoresRef = collection(db, "scores");
    const userSnapshot = await getDocs(usersRef);
    const scoreSnapshot = await getDocs(scoresRef);

    let userScores = {};
    scoreSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId; // Make sure this matches the user ID in your Firestore
        if (userScores[userId]) {
            userScores[userId].points += data.points; // Accumulate points for each user
        } else {
            userScores[userId] = { points: data.points, quizzesTaken: 1 }; // Initialize if not existing
        }
    });

    let users = [];
    userSnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
            id: doc.id,
            name: userData.firstName + ' ' + userData.lastName, // Concatenating first and last names
            rank: userData.rank || "Beginner", // Default rank
            points: userScores[doc.id] ? userScores[doc.id].points : 0 // Default to 0 if no scores found
        });
    });

    return users;
};


const calculateNextRankThreshold = (currentRank) => {
    const basePoints = 100;
    return basePoints + currentRank * 100;
};
