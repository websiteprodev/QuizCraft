import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "@/configs/firebase";

function Comments() {
    const [students, setStudents] = useState([]);
    const [selectedStudentQuizzes, setSelectedStudentQuizzes] = useState(null);
    const [selectedQuizQuestions, setSelectedQuizQuestions] = useState({});
    const [studentAnswers, setStudentAnswers] = useState({});
    const [comments, setComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQuiz, setShowQuiz] = useState(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentsCollection = collection(db, 'users');
                const studentsSnapshot = await getDocs(studentsCollection);
                const studentsList = studentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setStudents(studentsList);
            } catch (error) {
                setError('Failed to load students');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleViewQuizzes = async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const studentDocRef = doc(db, 'users', studentId);
            const studentDoc = await getDoc(studentDocRef);

            if (studentDoc.exists()) {
                const quizzes = studentDoc.data().quizzesTaken || [];
                const questionsMap = {};
                const answersMap = {};

                if (quizzes.length > 0) {
                    for (let quiz of quizzes) {
                        if (!quiz.quizId) continue;
                        try {
                            const questionsCollection = collection(db, 'quizzes', quiz.quizId, 'questions');
                            const questionsSnapshot = await getDocs(questionsCollection);
                            const questions = questionsSnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));
                            questionsMap[quiz.quizId] = questions;

                            const answersCollection = collection(db, 'users', studentId, 'quizzes', quiz.quizId, 'answers');
                            const answersSnapshot = await getDocs(answersCollection);
                            const answers = answersSnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));
                            answersMap[quiz.quizId] = answers;
                        } catch (err) {
                            console.error(`Failed to fetch data for quiz ID ${quiz.quizId}:`, err);
                        }
                    }
                    setSelectedQuizQuestions(questionsMap);
                    setStudentAnswers(answersMap);
                }
                setSelectedStudentQuizzes(quizzes);
            } else {
                throw new Error('No quizzes found for this student');
            }
        } catch (error) {
            setError('Failed to load quizzes');
        } finally {
            setLoading(false);
        }
    };

    const handleViewQuizDetails = (quizId) => {
        setShowQuiz(prevQuizId => prevQuizId === quizId ? null : quizId);
    };

    const handleCommentChange = (quizId, questionId, comment) => {
        setComments(prev => ({ ...prev, [`${quizId}-${questionId}`]: comment }));
    };

    const handleSaveComment = async (quizId, questionId) => {
        const comment = comments[`${quizId}-${questionId}`];
        try {
            const questionDocRef = doc(db, 'quizzes', quizId, 'questions', questionId);
            await updateDoc(questionDocRef, {
                comments: comment
            });
            alert('Comment saved!');
        } catch (error) {
            alert('Failed to save comment');
        }
    };

    if (loading) {
        return <div className="text-center text-lg text-gray-500 dark:text-gray-300">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-blue-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-center text-blue-700 dark:text-yellow-300 mb-8">Comments Section</h1>

            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg mb-8">
                <thead>
                    <tr className="bg-blue-100 dark:bg-gray-900 border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Student Name</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map(student => (
                            <tr key={student.id} className="border-b dark:border-gray-700">
                                <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{student.firstName || "Unnamed Student"}</td>
                                <td className="py-3 px-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                                        onClick={() => handleViewQuizzes(student.id)}
                                    >
                                        View Quizzes
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="py-3 px-4 text-gray-500 dark:text-gray-400 text-center">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedStudentQuizzes && (
                <div className="quizzes-section">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Quizzes</h2>
                    {selectedStudentQuizzes.length > 0 ? (
                        selectedStudentQuizzes.map((quiz, index) => (
                            <div key={index} className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">{quiz.title || `Quiz ${index + 1}`}</h3>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4 transition-all duration-200"
                                    onClick={() => handleViewQuizDetails(quiz.quizId)}
                                >
                                    {showQuiz === quiz.quizId ? 'Hide Details' : 'View Answers'}
                                </button>
                                <div
                                    className={`transition-all duration-500 ease-in-out transform ${
                                        showQuiz === quiz.quizId ? 'max-h-full opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                    }`}
                                >
                                    {showQuiz === quiz.quizId && (
                                        <div className="quiz-details bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                                            {selectedQuizQuestions[quiz.quizId] ? (
                                                selectedQuizQuestions[quiz.quizId].length > 0 ? (
                                                    selectedQuizQuestions[quiz.quizId].map((question, qIndex) => (
                                                        <div key={qIndex} className="mb-4">
                                                            <p className="text-gray-800 dark:text-gray-300 mb-2">{question.text}</p>
                                                            <textarea
                                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                                value={comments[`${quiz.quizId}-${question.id}`] || ''}
                                                                onChange={(e) => handleCommentChange(quiz.quizId, question.id, e.target.value)}
                                                                placeholder="Add a comment on this question"
                                                            />
                                                            <button
                                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                                                                onClick={() => handleSaveComment(quiz.quizId, question.id)}
                                                            >
                                                                Save Comment
                                                            </button>
                                                            {studentAnswers[quiz.quizId] && studentAnswers[quiz.quizId].map((answer) => (
                                                                answer.questionId === question.id ? (
                                                                    <div key={answer.id} className="mt-2">
                                                                        <p className="text-gray-700 dark:text-gray-400"><strong>Your Answer:</strong> {answer.answer}</p>
                                                                    </div>
                                                                ) : null
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400">No questions available for this quiz.</p>
                                                )
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400">Loading questions...</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 dark:text-gray-400">No quizzes found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Comments;
