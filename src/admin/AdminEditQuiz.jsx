import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Card, Input, Button, Typography, Switch } from "@material-tailwind/react";
import { useAuth } from '@/pages/auth/AuthContext'; 

const AdminEditQuiz = () => {
    const { id } = useParams();  // ID на куиза от URL-а
    const [quiz, setQuiz] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [questions, setQuestions] = useState([{ text: "", answers: ["", "", "", ""], correctAnswer: "" }]);
    const [isRandomized, setIsRandomized] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Проверка дали потребителят е администратор
    useEffect(() => {
        if (user?.role !== "admin") {
            navigate("/dashboard/home");
        }
    }, [user, navigate]);

    // Зареждане на куиза по ID
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
                    setIsRandomized(quizData.isRandomized);
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
            await updateDoc(quizRef, {
                title,
                category,
                questions,
                isRandomized,
            });
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
            <Typography variant="h4" className="mb-4">Edit Quiz</Typography>
            <Card className="p-6">
                <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-4" />
                <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="mb-4" />
                {questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="mb-4">
                        <Input
                            label={`Question ${questionIndex + 1}`}
                            value={question.text}
                            onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
                        />
                        {question.answers.map((answer, answerIndex) => (
                            <Input
                                key={answerIndex}
                                label={`Answer ${answerIndex + 1}`}
                                value={answer}
                                onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                                className="mt-2"
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
                <Button onClick={addQuestion} className="mb-4">Add Another Question</Button>
                <Switch
                    label="Randomize Questions"
                    checked={isRandomized}
                    onChange={(e) => setIsRandomized(e.target.checked)}
                    className="mb-4"
                />
                <Button onClick={handleSave} color="blue">
                    Save Changes
                </Button>
            </Card>
        </div>
    );
};

export default AdminEditQuiz;
