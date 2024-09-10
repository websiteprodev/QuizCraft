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

export const subscribeToQuiz = async (userId, quizId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const quizRef = doc(db, 'quizzes', quizId);

        const quizSnapshot = await getDoc(quizRef);
        if (quizSnapshot.exists() && quizSnapshot.data().isPublic) {
            await updateDoc(userRef, {
                subscribedQuizzes: firebase.firestore.FieldValue.arrayUnion(quizId),
            });
        } else {
            throw new Error('Quiz is not public');
        }
    } catch (error) {
        console.error('Error subscribing to quiz: ', error);
    }
};

const convertToICSFormat = (timestamp) => {
    const date = timestamp.toDate();
    return date.toISOString().replace(/[-:]/g, '').split('.')[0];
};
export const createICSFile = (quizData) => {
    const icsContent = `
    BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    SUMMARY:${quizData.title}
    DESCRIPTION:Join this quiz titled "${quizData.title}"
    DTSTART:${convertToICSFormat(quizData.createdAt)}
    DURATION:PT${quizData.timer}M
    END:VEVENT
    END:VCALENDAR
    `;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${quizData.title}.ics`;
    link.click();
};



export const fetchQuizzes = async () => {
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    return quizzesSnapshot.docs.map((doc) => ({
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

        if (updatedPoints === userData.points) {
            console.log('Points are already up to date');
            return;
        }

        const nextRankThreshold = calculateNextRankThreshold(userData.rank || 0);
        if (updatedPoints >= nextRankThreshold) {
            await updateDoc(userRef, {
                points: updatedPoints,
                rank: (userData.rank || 0) + 1,
            });
        } else {
            await updateDoc(userRef, {
                points: updatedPoints,
            });
        }

        console.log('Updated user:', userId, 'with points:', updatedPoints);
    } else {
        console.error('User not found');
    }
};

export const recordQuizScore = async (quizId, userId, score) => {
    try {
        const scoreRef = doc(db, 'quizzes', quizId, 'scores', userId);
        await setDoc(scoreRef, { score, userId }, { merge: true });
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
        return querySnapshot.docs.map((doc) => ({
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
        return querySnapshot.docs.map((doc) => ({
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

let userRankCache = {}; 
export const fetchUserRankAndProgress = async (username) => {
    if (userRankCache[username]) {
        return userRankCache[username];
    }

    console.log(`Attempting to fetch rank for user username: ${username}`);
    try {
        const userDocRef = doc(db, 'users', username);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            console.log(`No document found for user username: ${username}`);
            return { error: 'User not found', username };
        }

        const userData = userDoc.data();
        const rank = userData.rank || 'Beginner';
        const points = userData.points || 0;
        const nextRankProgress = (points % 100) / 100 * 100;

        const rankData = {
            rank,
            points,
            nextRankProgress,
        };

        userRankCache[username] = rankData; 
        return rankData;
    } catch (error) {
        console.error('Error fetching user rank and progress:', error);
        throw error;
    }
};

export const fetchUsersData = async () => {
    try {
        const usersCollectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        console.log(querySnapshot.docs.map((doc) => doc.data()));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export const fetchUsersWithScores = async () => {
    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersRef);

    let users = [];

    userSnapshot.forEach((doc) => {
        const userData = doc.data();
        const points = userData.points || 0;
        const rank = userData.rank || 'Beginner';

        users.push({
            id: doc.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            rank: rank,
            points: points,
        });
    });

    console.log('Users with Points:', users);
    return users;
};

const calculateNextRankThreshold = (currentRank) => {
    const basePoints = 100;
    return basePoints + currentRank * 100;
};

export const fetchUserScores = async (userId) => {
    try {
        const scoresCollectionRef = collection(db, 'quizzes');
        const q = query(scoresCollectionRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const scores = [];
        querySnapshot.forEach((doc) => {
            const quizData = doc.data();
            scores.push({
                quizId: doc.id,
                title: quizData.title,
                score: quizData.score,
                totalPoints: quizData.totalPoints,
            });
        });

        return scores;
    } catch (error) {
        console.error('Error fetching user scores:', error);
        return [];
    }
};
