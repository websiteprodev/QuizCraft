import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "@material-tailwind/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/configs/firebase";

export function TakeQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizDoc = await getDoc(doc(db, "quizzes", id));
                if (quizDoc.exists()) {
                    setQuiz(quizDoc.data());
                } else {
                    console.error("No such quiz!");
                }
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleNextQuestion = () => {
        if (quiz.questions[currentQuestionIndex].correctAnswer === selectedAnswer) {
            setScore(score + quiz.questions[currentQuestionIndex].points);
        }
        setSelectedAnswer("");
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            navigate(`/dashboard/quiz/${id}/result`, { state: { score } });
        }
    };

    return (
        <div className="p-6 dark:text-gray-100">
            {quiz ? (
                <Card className="p-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                    <Typography variant="h5" className="mb-4 dark:text-white">
                        Question {currentQuestionIndex + 1}
                    </Typography>
                    <Typography variant="paragraph" className="mb-4 dark:text-gray-300">
                        {quiz.questions[currentQuestionIndex].text}
                    </Typography>
                    {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <label key={index} className="flex items-center mb-2 dark:text-gray-300">
                            <input
                                type="radio"
                                value={answer}
                                checked={selectedAnswer === answer}
                                onChange={() => setSelectedAnswer(answer)}
                                className="mr-2 h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
                            />
                            <span className="ml-2">{answer}</span>
                        </label>
                    ))}
                    <Button
                        variant="gradient"
                        color="blue"
                        className="mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-800 dark:text-gray-100"
                        onClick={handleNextQuestion}
                    >
                        {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
                    </Button>
                </Card>
            ) : (
                <Typography className="dark:text-gray-400">Loading...</Typography>
            )}
        </div>
    );
}

export default TakeQuiz;
