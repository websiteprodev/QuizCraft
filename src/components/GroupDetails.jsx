
import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from '@material-tailwind/react';
import { useGroupContext } from '@/context/GroupContext';
import { db } from '@/configs/firebase';
import {
    collection,
    getDocs,
    query,
    where,
    doc,
    deleteDoc,
} from 'firebase/firestore';

export function GroupDetails() {
    const { currentGroup } = useGroupContext();
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        if (currentGroup) {
            const fetchQuizzes = async () => {
                const q = query(
                    collection(db, 'quizzes'),
                    where('groupId', '==', currentGroup.id),
                );
                const querySnapshot = await getDocs(q);
                setQuizzes(
                    querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })),
                );
            };
            fetchQuizzes();
        }
    }, [currentGroup]);

    const deleteQuiz = async (quizId) => {
        await deleteDoc(doc(db, 'quizzes', quizId));
        setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    };

    return currentGroup ? (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">
                {currentGroup.name}
            </Typography>
            <Typography variant="h6" className="mb-2">
                Quizzes
            </Typography>
            {quizzes.map((quiz) => (
                <Card key={quiz.id} className="p-4 mb-4">
                    <Typography variant="h6">{quiz.title}</Typography>
                    <Button onClick={() => deleteQuiz(quiz.id)} color="red">
                        Delete Quiz
                    </Button>
                </Card>
            ))}
            <Button>Create New Quiz</Button>
        </div>
    ) : (
        <Typography>Please select a group.</Typography>
    );
}
