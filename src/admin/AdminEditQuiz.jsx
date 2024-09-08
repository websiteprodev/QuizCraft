import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Card, Input, Button, Typography, Switch } from "@material-tailwind/react";
import { useAuth } from '@/pages/auth/AuthContext'; 

const AdminEditQuiz = () => {
    const { id } = useParams();  
    const [quiz, setQuiz] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [questions, setQuestions] = useState([{ text: "", answers: ["", "", "", ""], correctAnswer: "" }]);
    const [isRandomized, setIsRandomized] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const quizRef = doc(db, "quizzes", id);
                const quizSnap = await getDoc(quizRef);

                if (quizSnap.exists()) {
                    const quizData = quizSnap.data();
                    setQuiz(quizData);
                    setTitle(quizData.title);
                    setCategory(quizData.category);
                    setQuestions(quizData.questions);
                    setIsRandomized(quizData.isRandomized || false);  
                } else {
                    console.error("Quiz not found!");
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        loadQuiz();
    }, [id]);

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: "", answers: ["", "", "", ""], correctAnswer: "" }]);
    };

    const handleSave = async () => {
        try {
            const quizRef = doc(db, "quizzes", id);
            
            const updatedQuizData = {
                title,
                category,
                questions,
            };
            
            
            if (typeof isRandomized !== "undefined") {
                updatedQuizData.isRandomized = isRandomized;
            }

            await updateDoc(quizRef, updatedQuizData);
            alert("Quiz updated successfully!");
            navigate("/dashboard/admin");
        } catch (error) {
            console.error("Error updating quiz:", error);
        }
    };

    if (!quiz) {
        return <Typography>Loading quiz data...</Typography>;
    }

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-6">Edit Quiz</Typography>
            <Card className="p-6 space-y-6">
                <div className="space-y-4">
                    <Input 
                        label="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                    <Input 
                        label="Category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                    />
                </div>

                <div className="space-y-6">
                    {questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="border-b pb-6">
                            <Input
                                label={`Question ${questionIndex + 1}`}
                                value={question.text}
                                onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
                                className="mb-4"
                            />
                            {question.answers.map((answer, answerIndex) => (
                                <Input
                                    key={answerIndex}
                                    label={`Answer ${answerIndex + 1}`}
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                                    className="mb-2"
                                />
                            ))}
                            <Input
                                label="Correct Answer"
                                value={question.correctAnswer}
                                onChange={(e) => handleQuestionChange(questionIndex, "correctAnswer", e.target.value)}
                                className="mt-2"
                            />
                        </div>
                    ))}
                </div>

                <Button onClick={addQuestion} className="mt-6" variant="gradient" color="blue">
                    Add Another Question
                </Button>

                <div className="flex items-center mt-6 space-x-4">
                    <Switch
                        label="Randomize Questions"
                        checked={isRandomized}
                        onChange={(e) => setIsRandomized(e.target.checked)}
                    />
                    <Typography>Randomize Questions</Typography>
                </div>

                <Button onClick={handleSave} className="mt-6" color="green">
                    Save Changes
                </Button>
            </Card>
        </div>
    );
};

export default AdminEditQuiz;
