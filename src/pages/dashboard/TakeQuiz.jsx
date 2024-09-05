import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "@material-tailwind/react";
import { fetchQuizById, recordQuizScore } from "@/services/quizService";
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
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswerIndex = parseInt(currentQuestion.correctAnswer, 10) - 1;

        if (quiz.questions[currentQuestionIndex].answers[correctAnswerIndex] === selectedAnswer) {
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

    const calculateDashOffset = () => {
        const maxTime = quiz.timer;
        const dashArray = 283; // Circumference of the circle
        const dashOffset = (dashArray * timeLeft) / maxTime;
        return dashOffset;
    };

    return (
        <div className="p-6 dark:text-gray-100">
            {quiz ? (
                isQuizFinished ? (
                    <Card className="p-6 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-lg">
                        <Typography variant="h5" className="mb-4 text-gray-900 dark:text-gray-100">
                            Quiz Finished! Your Score: {score}/{quiz.totalPoints}
                        </Typography>
                        <Button
                            variant="gradient"
                            color="blue"
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={handleTakeAnotherQuiz}
                        >
                            Take Another Quiz
                        </Button>
                    </Card>
                ) : (
                    <Card className="p-6 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-lg">
                        <Typography variant="h5" className="mb-4 text-gray-900 dark:text-gray-100">
                            Question {currentQuestionIndex + 1}
                        </Typography>
                        <Typography variant="paragraph" className="mb-4 text-gray-700 dark:text-gray-300">
                            {quiz.questions[currentQuestionIndex].text}
                        </Typography>
                        {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                            <label key={index} className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
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
                        <div className="mt-4 mb-4 flex flex-col items-center relative">
                            <svg width="100" height="100" className="countdown-timer">
                                <circle
                                    r="45"
                                    cx="50"
                                    cy="50"
                                    className="circle"
                                    style={{ strokeDashoffset: calculateDashOffset(), stroke: "#4FD1C5" }}
                                ></circle>
                            </svg>
                            <div className="timer-text text-gray-900 dark:text-gray-100">
                                {timeLeft}
                            </div>
                        </div>
                        <Button
                            variant="gradient"
                            color="blue"
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
