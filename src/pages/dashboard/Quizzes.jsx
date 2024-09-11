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
    getDoc,
} from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Link } from 'react-router-dom';
import { subscribeToQuiz, createICSFile } from '@/services/quizService';
import { useAuth } from '@/pages/auth/AuthContext.jsx';

export function Quizzes() {
    const { user } = useAuth(); // Access user from useAuth hook
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [takenQuizzes, setTakenQuizzes] = useState([]);
    const [publicQuizzes, setPublicQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newQuizNotification, setNewQuizNotification] = useState(null); // State for new quiz notifications

    // Visibility counts for Load More functionality
    const [visibleCreatedQuizzes, setVisibleCreatedQuizzes] = useState(3);
    const [visiblePublicQuizzes, setVisiblePublicQuizzes] = useState(3);
    const [visibleTakenQuizzes, setVisibleTakenQuizzes] = useState(3);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                if (!user) {
                    console.error('User not logged in');
                    return;
                }

                // Fetch quizzes created by the user
                const createdBy = `${user.firstName} ${user.lastName}`;
                const createdQuizzesRef = query(
                    collection(db, 'quizzes'),
                    where('createdBy', '==', createdBy),
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
                        // Instead of alert, set the notification in state
                        setNewQuizNotification(
                            `New public quiz available: ${newQuiz.title}`,
                        );
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

            // Fetch quiz data by quizId
            const quizRef = doc(db, 'quizzes', quizId);
            const quizSnapshot = await getDoc(quizRef);

            if (!quizSnapshot.exists()) {
                alert('Quiz not found.');
                return;
            }

            const quizData = quizSnapshot.data();

            // Call createICS and pass quizData
            createICSFile(quizData);

            alert(
                'You have subscribed to the quiz and the .ics file is downloaded!',
            );
        } catch (error) {
            console.error('Error subscribing to quiz:', error);
        }
    };

    const handleLoadMore = (section) => {
        if (section === 'created') {
            setVisibleCreatedQuizzes((prev) => prev + 3);
        } else if (section === 'public') {
            setVisiblePublicQuizzes((prev) => prev + 3);
        } else if (section === 'taken') {
            setVisibleTakenQuizzes((prev) => prev + 3);
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

            {/* Notification for new public quizzes */}
            {newQuizNotification && (
                <div className="p-4 bg-blue-100 text-blue-900 rounded-md mb-6">
                    {newQuizNotification}
                    <button
                        className="ml-4 text-blue-500 hover:text-blue-700"
                        onClick={() => setNewQuizNotification(null)} // Dismiss notification
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Created Quizzes Section */}
            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Created Quizzes
                </Typography>
                {createdQuizzes.slice(0, visibleCreatedQuizzes).map((quiz) => (
                    <div key={quiz.id} className="mb-4">
                        <Typography variant="h6" className="dark:text-gray-200">
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
                ))}
                {visibleCreatedQuizzes < createdQuizzes.length && (
                    <div className="flex justify-center w-full mt-4">
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={() => handleLoadMore('created')}
                            className="py-1 px-4 text-sm" // Smaller and centered button
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </Card>

            {/* Public Quizzes Section */}
            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4">
                    Public Quizzes
                </Typography>
                {publicQuizzes.slice(0, visiblePublicQuizzes).map((quiz) => (
                    <div key={quiz.id} className="mb-4">
                        <Typography variant="h6" className="dark:text-gray-200">
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
                ))}
                {visiblePublicQuizzes < publicQuizzes.length && (
                    <div className="flex justify-center w-full mt-4">
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={() => handleLoadMore('public')}
                            className="py-1 px-4 text-sm" // Smaller and centered button
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </Card>

            {/* Taken Quizzes Section */}
            <Card className="p-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Taken Quizzes
                </Typography>
                {takenQuizzes.slice(0, visibleTakenQuizzes).map((quiz, index) => (
                    <div key={index} className="mb-4 ">
                        <Typography variant="h6" className="dark:text-gray-200">
                            {quiz.title}
                        </Typography>
                        <Typography variant="paragraph">
                            Points Scored: {quiz.points}
                        </Typography>
                        <hr className="my-4" />
                    </div>
                ))}
                {visibleTakenQuizzes < takenQuizzes.length && (
                    <div className="flex justify-center w-full mt-4">
                        <Button
                            variant="gradient"
                            color="blue"
                            onClick={() => handleLoadMore('taken')}
                            className="py-1 px-4 text-sm" // Smaller and centered button
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}

export default Quizzes;
