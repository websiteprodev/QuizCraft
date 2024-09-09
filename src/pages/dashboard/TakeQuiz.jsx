import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "@material-tailwind/react";
import { fetchQuizById, recordQuizScore } from "@/services/quizService";
import { useAuth } from "../auth/AuthContext";
import { updateUserQuizzesTaken } from "@/services/userService";
import Confetti from "react-confetti";

export function TakeQuiz() {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null); 
    const [answerResult, setAnswerResult] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false); 
    const [screenCracked, setScreenCracked] = useState(false); 
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const quizData = await fetchQuizById(id);
                console.log("Fetched Quiz Data:", quizData); 
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
            handleTimeExpired(); 
        }

        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearInterval(timerId);
        }
    }, [timeLeft]);

    const handleNextQuestion = () => {
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            console.error("Quiz data is not loaded correctly.");
            return;
        }

        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correctAnswerIndex = parseInt(currentQuestion.correctAnswer, 10) - 1;

        console.log("Correct Answer Index:", correctAnswerIndex);
        console.log("Selected Answer:", selectedAnswer);
        console.log("Question Points:", currentQuestion.points);

        if (currentQuestion.answers[correctAnswerIndex] === selectedAnswer) {
            console.log("Answer is correct. Adding points:", currentQuestion.points);
            setScore((prevScore) => prevScore + currentQuestion.points);  
            setAnswerResult("Correct Answer!");
            setShowConfetti(true); 
            setScreenCracked(false); 
        } else {
            setAnswerResult("Wrong Answer!");
            setShowConfetti(false);
            setScreenCracked(true); 
        }

        setTimeout(() => {
            setSelectedAnswer("");
            setShowConfetti(false);
            setScreenCracked(false); 
            setAnswerResult(null);

            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setTimeLeft(quiz.timer); 
            } else {
                setIsQuizFinished(true);
            }
        }, 2000);
    };

    const handleTimeExpired = () => {
        setAnswerResult("Time's up!");
        setScreenCracked(true); 

        setTimeout(() => {
            setSelectedAnswer("");
            setScreenCracked(false);
            setAnswerResult(null);

            if (currentQuestionIndex < quiz.questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setTimeLeft(quiz.timer); 
            } else {
                setIsQuizFinished(true);
            }
        }, 2000);
    };

    useEffect(() => {
        if (isQuizFinished) {
            saveScore();
            updateUserQuizzesTaken(user.username, id, score);
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
        const maxTime = quiz ? quiz.timer : 1;  
        const dashArray = 283;
        const dashOffset = (dashArray * timeLeft) / maxTime;
        return dashOffset;
    };

    return (
        <div className={`p-6 text-gray-900 dark:text-gray-100 ${screenCracked ? "cracked-screen" : ""}`}>
            {quiz && quiz.questions && quiz.questions.length > 0 ? (
                isQuizFinished ? (
                    <Card className="p-6 bg-yellow-100 dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-xl border-4 border-red-500 animate__animated animate__fadeIn">
                        <Typography variant="h5" className="mb-4 text-center text-blue-800 font-bold">
                            🎉 Quiz Finished! Your Score: {score}/{quiz.totalPoints}
                        </Typography>
                        <Button
                            variant="gradient"
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md text-lg"
                            onClick={handleTakeAnotherQuiz}
                        >
                            Take Another Quiz
                        </Button>
                    </Card>
                ) : (
                    <Card className="p-6 bg-yellow-100 dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-xl border-4 border-red-500 animate__animated animate__fadeIn">
                        <Typography variant="h4" className="mb-4 text-left text-red-500 font-bold">
                            🌟 Question {currentQuestionIndex + 1}
                        </Typography>
                        <Typography variant="h6" className="mb-4 text-left text-gray-700 dark:text-gray-300 font-bold">
                            {quiz.questions[currentQuestionIndex].text}
                        </Typography>
                        <div className="flex flex-col items-start space-y-4">
                            {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                                <label key={index} className="flex items-center justify-start mb-2 text-blue-700 dark:text-gray-300 font-semibold">
                                    <input
                                        type="radio"
                                        value={answer}
                                        checked={selectedAnswer === answer}
                                        onChange={() => setSelectedAnswer(answer)}
                                        className="mr-2 h-5 w-5 text-green-500 bg-yellow-100 border-red-500 focus:ring-green-500"
                                    />
                                    <span className="ml-2">{answer}</span>
                                </label>
                            ))}
                        </div>
                        {showConfetti && <Confetti />}
                        <div className="mt-4 mb-4 flex flex-col items-center relative">
                            <svg width="100" height="100" className="countdown-timer">
                                <circle
                                    r="45"
                                    cx="50"
                                    cy="50"
                                    className="circle"
                                    style={{ strokeDashoffset: calculateDashOffset(), stroke: "#F25C05" }}
                                ></circle>
                            </svg>
                            <div className="timer-text text-red-600 font-bold">
                                {timeLeft}
                            </div>
                        </div>
                        {answerResult && (
                            <div className={`mt-4 mb-4 text-lg font-bold animate__animated ${answerResult === "Correct Answer!" ? "text-green-500 animate__bounceIn" : "text-red-500 animate__shakeX"}`}>
                                {answerResult}
                            </div>
                        )}

                        <div className="mt-4">
                            <Button
                                variant="gradient"
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md text-lg"
                                onClick={handleNextQuestion}
                            >
                                {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
                            </Button>
                        </div>
                    </Card>
                )
            ) : (
                <Typography className="dark:text-gray-400">Loading...</Typography>
            )}
        </div>
    );
}

export default TakeQuiz;
