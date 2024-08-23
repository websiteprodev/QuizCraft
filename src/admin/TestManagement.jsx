import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Table } from "@material-tailwind/react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/configs/firebase";

function TestManagement() {
    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
            setQuizzes(quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchQuizzes();
    }, []);

    const handleDeleteQuiz = async (quizId) => {
        await deleteDoc(doc(db, "quizzes", quizId));
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    };

    return (
        <Card>
            <Typography variant="h5" className="mb-4">Test Management</Typography>
            <Table>
                {/* Table header and rows with actions */}
            </Table>
        </Card>
    );
}

export default TestManagement;
