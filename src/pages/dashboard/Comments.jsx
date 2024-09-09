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

                console.log("Students data:", studentsList);

                setStudents(studentsList);
            } catch (error) {
                console.error('Error fetching students:', error);
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

                console.log("Quizzes data for student:", quizzes);

                if (quizzes.length > 0) {
                    for (let quiz of quizzes) {
                        console.log("Processing Quiz ID:", quiz.quizId);
                        if (!quiz.quizId) {
                            console.error("Invalid quiz ID", quiz);
                            continue;
                        }
                        try {
                            
                            const questionsCollection = collection(db, 'quizzes', quiz.quizId, 'questions');
                            const questionsSnapshot = await getDocs(questionsCollection);
                            const questions = questionsSnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));
                            questionsMap[quiz.quizId] = questions;

                            console.log(`Questions for quiz ${quiz.quizId}:`, questions);

                            
                            const answersCollection = collection(db, 'users', studentId, 'quizzes', quiz.quizId, 'answers');
                            const answersSnapshot = await getDocs(answersCollection);
                            const answers = answersSnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));
                            answersMap[quiz.quizId] = answers;

                            console.log(`Answers for quiz ${quiz.quizId}:`, answers);
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
            console.error('Error fetching quizzes:', error);
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
            console.error('Error saving comment:', error);
            alert('Failed to save comment');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Comments Section</h1>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map(student => (
                            <tr key={student.id}>
                                <td>{student.firstName ? student.firstName : "Unnamed Student"}</td>
                                <td>
                                    <button onClick={() => handleViewQuizzes(student.id)}>
                                        View Quizzes
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {selectedStudentQuizzes && (
                <div>
                    <h2>Quizzes</h2>
                    {selectedStudentQuizzes.length > 0 ? (
                        selectedStudentQuizzes.map((quiz, index) => (
                            <div key={index}>
                                <h3>{quiz.title ? quiz.title : `Quiz ${index + 1}`}</h3>
                                <button onClick={() => handleViewQuizDetails(quiz.quizId)}>
                                    {showQuiz === quiz.quizId ? 'Hide Details' : 'View Answers'}
                                </button>
                                {showQuiz === quiz.quizId && (
                                    <div>
                                        {selectedQuizQuestions[quiz.quizId] ? (
                                            selectedQuizQuestions[quiz.quizId].length > 0 ? (
                                                selectedQuizQuestions[quiz.quizId].map((question, qIndex) => (
                                                    <div key={qIndex}>
                                                        <p>{question.text}</p>
                                                        <textarea
                                                            value={comments[`${quiz.quizId}-${question.id}`] || ''}
                                                            onChange={(e) => handleCommentChange(quiz.quizId, question.id, e.target.value)}
                                                            placeholder="Add a comment on this question"
                                                        />
                                                        <button onClick={() => handleSaveComment(quiz.quizId, question.id)}>
                                                            Save Comment
                                                        </button>
                                                        {studentAnswers[quiz.quizId] && studentAnswers[quiz.quizId].map((answer) => (
                                                            answer.questionId === question.id ? (
                                                                <div key={answer.id}>
                                                                    <p><strong>Your Answer:</strong> {answer.answer}</p>
                                                                </div>
                                                            ) : null
                                                        ))}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No questions available for this quiz.</p>
                                            )
                                        ) : (
                                            <p>Loading questions...</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div>No quizzes found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Comments;

