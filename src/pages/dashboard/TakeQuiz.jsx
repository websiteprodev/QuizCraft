import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "@material-tailwind/react";
import { fetchQuizById, recordQuizScore } from "@/services/quizService";
import { auth } from "@/configs/firebase";
import { useAuth } from "../auth/AuthContext";

export function TakeQuiz() {
    const { id } = useParams();  
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);  
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const quizData = await fetchQuizById(id);
                setQuiz(quizData);
                setTimeLeft(quizData.timer);  
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };
        loadQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleNextQuestion();  
        }

        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const handleNextQuestion = () => {
        if (quiz.questions[currentQuestionIndex].correctAnswer === selectedAnswer) {
            setScore((prevScore) => prevScore + quiz.questions[currentQuestionIndex].points);
        }
        setSelectedAnswer("");
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(quiz.timer);  
        } else {
            setIsQuizFinished(true);
        }
    };

    useEffect(() => {
        if (isQuizFinished) {
            saveScore();
        }
    }, [isQuizFinished]);

    const saveScore = async () => {
        if (user) {
            try {
                await recordQuizScore(id, user.username, score);
            } catch (error) {
                console.error("Error recording score:", error);
            }
        } else {
            console.error("User is not logged in");
        }
    };

    const handleTakeAnotherQuiz = () => {
        navigate("/dashboard/browse-quizzes");
    };

    return (
        <div className="p-6 dark:text-gray-100">
            {quiz ? (
                isQuizFinished ? (
                    <Card className="p-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 text-center">
                        <Typography variant="h5" className="mb-4 dark:text-white">
                            End of Quiz
                        </Typography>
                        <Typography variant="h6" className="mb-4 dark:text-white">
                            Your score is: {score}
                        </Typography>
                        <Button
                            variant="gradient"
                            color="blue"
                            className="mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-800 dark:text-gray-100"
                            onClick={handleTakeAnotherQuiz}
                        >
                            Take Another Quiz
                        </Button>
                    </Card>
                ) : (
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
                        <Typography className="dark:text-red-500 text-red-500 font-bold mt-4">Time Left: {timeLeft} seconds</Typography> 
                        <Button
                            variant="gradient"
                            color="blue"
                            className="mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-800 dark:text-gray-100"
                            onClick={handleNextQuestion}
                        >
                            {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
                        </Button>
                    </Card>
                )
            ) : (
                <Typography className="dark:text-gray-400">Loading...</Typography>
            )}
        </div>
    );
}

export default TakeQuiz;
