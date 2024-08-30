import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuizById, updateQuiz } from '@/services/quizService'; 
import { Card, CardBody, Typography, Button, Input } from '@material-tailwind/react'; 

const EditQuiz = () => {
    const { id } = useParams(); 
    const [quiz, setQuiz] = useState(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                if (!id) {
                    throw new Error("Quiz ID is missing.");
                }
                console.log("Quiz ID:", id); // Логване на ID-то на теста
                const quizData = await fetchQuizById(id); 
                setQuiz(quizData);
                setTitle(quizData.title); 
            } catch (error) {
                console.error("Error fetching quiz:", error);
                setError("Quiz not found or doesn't exist.");
            }
        };

        loadQuiz();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await updateQuiz(id, { title }); 
            alert('Quiz updated successfully!');
        } catch (error) {
            console.error('Error updating quiz:', error);
            alert('Failed to update quiz');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardBody>
                <Typography variant="h4" className="mb-4">Edit Quiz</Typography>
                <Input
                    type="text"
                    label="Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-4"
                />
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleUpdate}
                    fullWidth
                >
                    Update Title
                </Button>
            </CardBody>
        </Card>
    );
};

export default EditQuiz;
