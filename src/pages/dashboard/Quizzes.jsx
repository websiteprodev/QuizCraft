import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@material-tailwind/react';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    deleteDoc,
    onSnapshot
} from 'firebase/firestore';
import { db, auth } from '@/configs/firebase';
import { Link } from 'react-router-dom';
import { subscribeToQuiz, createICSFile } from '@/services/quizService';

export function Quizzes() {
    const [createdQuizzes, setCreatedQuizzes] = useState([]);
    const [takenQuizzes, setTakenQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [publicQuizzes, setPublicQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error('User not logged in');
                    return;
                }

                const createdQuizzesRef = query(collection(db, "quizzes"), where("createdBy", "==", user.uid));
                const createdQuizzesSnapshot = await getDocs(createdQuizzesRef);
                const createdQuizzesData = createdQuizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCreatedQuizzes(createdQuizzesData);

                const takenQuizzesRef = query(collection(db, "quizzes"), where("scores" + user.uid, "!=", null));
                const takenQuizzesSnapshot = await getDocs(takenQuizzesRef);
                const takenQuizzesData = takenQuizzesSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const score = data.scores[user.uid] || 0;
                    return { id: doc.id, ...data, score };
                });
                setTakenQuizzes(takenQuizzesData);

                const publicQuizzesRef = query(collection(db, "quizzes"), where("isPublic", "==", true));
                const publicQuizzesSnapshot = await getDocs(publicQuizzesRef);
                const publicQuizzesData = publicQuizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPublicQuizzes(publicQuizzesData);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "quizzes"), where("isPublic", "==", true)),
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const newQuiz = change.doc.data();
                        alert(`New public quiz available: ${newQuiz.title}`);
                    }
                });
            }
        );
        return () => unsubscribe();
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
            const user = auth.currentUser;
            if (!user) {
                alert('You need to log in to subscribe to a quiz.');
                return;
            }
            await subscribeToQuiz(user.uid, quizId);
            alert('You have subscribed to the quiz and the .ics file is downloaded!');
        } catch (error) {
            console.error('Error subscribing to quiz: ', error);
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

            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Created Quizzes
                </Typography>
                {createdQuizzes.length > 0 ? (
                    createdQuizzes.map((quiz) => (
                        <div key={quiz.id} className="mb-4">
                            <Typography variant="h6" className="dark:text-gray-200">{quiz.title}</Typography>
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

                            <hr className="my-4 dark:border-gray-600" />
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph" className="dark:text-gray-300">
                        No quizzes created.
                    </Typography>
                )}
            </Card>
            
            <Card className="p-6 mb-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Public Quizzes
                </Typography>
                {publicQuizzes.length > 0 ? (
                    publicQuizzes.map((quiz) => (
                        <div key={quiz.id} className="mb-4">
                            <Typography variant="h6" className="dark:text-gray-200">{quiz.title}</Typography>
                            <Typography variant="paragraph">Category: {quiz.category}</Typography>
                            <Typography variant="paragraph">Questions: {quiz.numberOfQuestions}</Typography>
                            <Button variant="gradient" color="green" onClick={() => handleSubscribeToQuiz(quiz.id)}>
                                Subscribe & Download .ics
                            </Button>
                            <hr className="my-4 dark:border-gray-600" />
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph" className="dark:text-gray-300">
                        No public quizzes available.
                    </Typography>
                )}
            </Card>

            <Card className="p-6 dark:bg-gray-800 dark:text-gray-100">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">
                    Taken Quizzes
                </Typography>
                {takenQuizzes.length > 0 ? (
                    takenQuizzes.map((quiz) => (
                        <div key={quiz.id} className="mb-4">
                            <Typography variant="h6" className="dark:text-gray-200">{quiz.title}</Typography>
                            <Typography variant="paragraph">Category: {quiz.category}</Typography>
                            <Typography variant="paragraph">Questions: {quiz.numberOfQuestions}</Typography>
                            <Typography variant="paragraph">Your Score: {quiz.score}</Typography>
                            <hr className="my-4 dark:border-gray-600" />
                        </div>
                    ))
                ) : (
                    <Typography variant="paragraph" className="dark:text-gray-300">
                        No quizzes taken.
                    </Typography>
                )}
            </Card>
        </div>
    );
}

export default Quizzes;
