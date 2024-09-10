import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button, Textarea, Typography } from '@material-tailwind/react';

const ReviewQuiz = () => {
    const { quizId } = useParams(); // Get quiz ID from route params
    const [answers, setAnswers] = useState([]);
    const [comments, setComments] = useState({}); // Store comments for each answer
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizAnswers = async () => {
            try {
                const db = getFirestore();
                const quizDoc = doc(db, 'quizzes', quizId);
                const quizSnapshot = await getDoc(quizDoc);
                
                if (quizSnapshot.exists()) {
                    const quizData = quizSnapshot.data();
                    setAnswers(quizData.participants || []); // Assuming `participants` contains answers
                } else {
                    console.error('Quiz not found');
                }
            } catch (error) {
                console.error('Error fetching quiz answers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizAnswers();
    }, [quizId]);

    const handleCommentChange = (participantId, questionId, comment) => {
        setComments({
            ...comments,
            [participantId]: {
                ...(comments[participantId] || {}),
                [questionId]: comment,
            },
        });
    };

    const saveComments = async () => {
        try {
            const db = getFirestore();
            const quizDocRef = doc(db, 'quizzes', quizId);

            // Assuming the participants array structure is like: 
            // participants: { participantId: { answers: [{ questionId, answer, comment }] } }
            await updateDoc(quizDocRef, {
                participants: answers.map((participant) => ({
                    ...participant,
                    answers: participant.answers.map((answer) => ({
                        ...answer,
                        comment: comments[participant.id]?.[answer.questionId] || answer.comment,
                    })),
                })),
            });

            alert('Comments saved successfully!');
        } catch (error) {
            console.error('Error saving comments:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">
                Review Quiz
            </Typography>

            {answers.map((participant) => (
                <div key={participant.id} className="mb-6">
                    <Typography variant="h6" className="mb-2">
                        Participant: {participant.name || 'Unknown'}
                    </Typography>
                    {participant.answers.map((answer) => (
                        <div key={answer.questionId} className="mb-4">
                            <Typography variant="paragraph" className="mb-2">
                                Question: {answer.questionText}
                            </Typography>
                            <Typography variant="paragraph" className="mb-2">
                                Answer: {answer.answerText}
                            </Typography>
                            <Textarea
                                label="Add a comment"
                                value={comments[participant.id]?.[answer.questionId] || answer.comment || ''}
                                onChange={(e) =>
                                    handleCommentChange(participant.id, answer.questionId, e.target.value)
                                }
                                className="mb-4"
                            />
                        </div>
                    ))}
                    <hr className="my-4" />
                </div>
            ))}

            <Button variant="gradient" color="green" onClick={saveComments}>
                Save Comments
            </Button>
        </div>
    );
};

export default ReviewQuiz;
