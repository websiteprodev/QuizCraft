import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@material-tailwind/react';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Link } from 'react-router-dom';
import { subscribeToQuiz } from '@/services/quizService';
import { useAuth } from '@/pages/auth/AuthContext.jsx';

export function Quizzes() {
    const { user } = useAuth(); // Access user from useAuth hook
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [takenQuizzes, setTakenQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publicQuizzes, setPublicQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                if (!user) {
                    console.error('User not logged in');
                    return;
                }

                // Fetch quizzes created by the user
                const createdQuizzesRef = query(
                    collection(db, 'quizzes'),
                    where('createdBy', '==', user.uid),
                );
                const createdQuizzesSnapshot = await getDocs(createdQuizzesRef); // Fetch the user's created quizzes
                const createdQuizzesData = createdQuizzesSnapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() }),
                );
                setCreatedQuizzes(createdQuizzesData);


                // Fetch quizzes based on the taken quizzes IDs from user.quizzesTaken
                const quizzesTaken = user.quizzesTaken || []; // Array of quiz IDs
                setTakenQuizzes(quizzesTaken);
            
                // Fetch public quizzes
                const publicQuizzesRef = query(
                    collection(db, 'quizzes'),
                    where('isPublic', '==', true),
                );
                const publicQuizzesSnapshot = await getDocs(publicQuizzesRef); // Fetch public quizzes
                const publicQuizzesData = publicQuizzesSnapshot.docs.map(
                    (doc) => ({ id: doc.id, ...doc.data() }),
                );
                setPublicQuizzes(publicQuizzesData);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [user]);

    useEffect(() => {
        // Real-time listener for public quizzes
        const unsubscribe = onSnapshot(
            query(collection(db, 'quizzes'), where('isPublic', '==', true)),
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const newQuiz = change.doc.data();
                        alert(`New public quiz available: ${newQuiz.title}`);
                    }
                });
            },
        );
        return () => unsubscribe(); // Unsubscribe from listener when component unmounts
    }, []);

    const handleDeleteQuiz = async (quizId) => {
        try {
            await deleteDoc(doc(db, 'quizzes', quizId));
            setCreatedQuizzes((prevQuizzes) =>
                prevQuizzes.filter((quiz) => quiz.id !== quizId),
            );
            alert('Quiz deleted successfully!');
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleSubscribeToQuiz = async (quizId) => {
        try {
            if (!user) {
                alert('You need to log in to subscribe to a quiz.');
                return;
            }
            await subscribeToQuiz(user.uid, quizId); // Subscribe and generate .ics file
            alert(
                'You have subscribed to the quiz and the .ics file is downloaded!',
            );
        } catch (error) {
            console.error('Error subscribing to quiz:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 dark:bg-gray-900">
            <Typography variant="h4" className="mb-4 dark:text-gray-100">
                Your Quizzes
            </Typography>

            {/* Created Quizzes Section */}
            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Created Quizzes
                </Typography>
                {createdQuizzes.length > 0 ? (
                    createdQuizzes.map((quiz) => (
                        <div key={quiz.id} className="mb-4">
                            <Typography
                                variant="h6"
                                className="dark:text-gray-200"
                            >
                                {quiz.title}
                            </Typography>
                            <Typography variant="paragraph">
                                Category: {quiz.category}
                            </Typography>
                            <Typography variant="paragraph">
                                Questions: {quiz.numberOfQuestions}
                            </Typography>

                            <div className="flex gap-2 mt-4">
                                <Link to={`/quizzes/edit/${quiz.id}`}>
                                    <Button variant="gradient" color="blue">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="outlined"
                                    color="red"
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                >
                                    Delete
                                </Button>
                            </div>

                            <hr className="my-4" />
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph">
                        No quizzes created.
                    </Typography>
                )}
            </Card>

            {/* Public Quizzes Section */}
            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4">
                    Public Quizzes
                </Typography>
                {publicQuizzes.length > 0 ? (
                    publicQuizzes.map((quiz) => (
                        <div key={quiz.id} className="mb-4">
                            <Typography
                                variant="h6"
                                className="dark:text-gray-200"
                            >
                                {quiz.title}
                            </Typography>
                            <Typography variant="paragraph">
                                Category: {quiz.category}
                            </Typography>
                            <Typography variant="paragraph">
                                Questions: {quiz.numberOfQuestions}
                            </Typography>
                            <Button
                                variant="gradient"
                                color="green"
                                onClick={() => handleSubscribeToQuiz(quiz.id)}
                            >
                                Subscribe & Download .ics
                            </Button>
                            <hr className="my-4 dark:border-gray-600" />
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph">
                        No public quizzes available.
                    </Typography>
                )}
            </Card>

            {/* Taken Quizzes Section */}
            <Card className="p-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Taken Quizzes
                </Typography>
                {takenQuizzes.length > 0 ? (
                    takenQuizzes.map((quiz, index) => (
                        <div key={index} className="mb-4 ">
                            <Typography
                                variant="h6"
                                className="dark:text-gray-200"
                            >
                                {quiz.title}
                            </Typography>
                            <Typography variant="paragraph">
                                Points Scored: {quiz.points}
                            </Typography>
                            <hr className="my-4" />
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph">
                        No quizzes taken.
                    </Typography>
                )}
            </Card>
        </div>
    );
}

export default Quizzes;
