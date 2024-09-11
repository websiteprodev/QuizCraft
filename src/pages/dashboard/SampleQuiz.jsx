import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Radio } from "@material-tailwind/react";
import Confetti from "react-confetti";

const sampleQuestions = [
    {
        text: "What is the capital of Bulgaria?",
        answers: ["Pleven", "Pernik", "Plovdiv", "Sofia"],
        correctAnswer: "Sofia",
    },
    {
        text: "What is the capital of France?",
        answers: ["Marseille", "Lyon", "Paris", "Nice"],
        correctAnswer: "Paris",
    },
    {
        text: "What is the capital of Germany?",
        answers: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
        correctAnswer: "Berlin",
    },
    {
        text: "What is the capital of Japan?",
        answers: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"],
        correctAnswer: "Tokyo",
    },
    {
        text: "What is the capital of Brazil?",
        answers: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"],
        correctAnswer: "Brasília",
    },
    {
        text: "What is the capital of Canada?",
        answers: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
        correctAnswer: "Ottawa",
    },
    {
        text: "What is the capital of Italy?",
        answers: ["Milan", "Rome", "Naples", "Florence"],
        correctAnswer: "Rome",
    },
    {
        text: "What is the capital of Australia?",
        answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        correctAnswer: "Canberra",
    },
    {
        text: "What is the capital of Russia?",
        answers: ["Saint Petersburg", "Moscow", "Novosibirsk", "Kazan"],
        correctAnswer: "Moscow",
    },
    {
        text: "What is the capital of Egypt?",
        answers: ["Alexandria", "Cairo", "Giza", "Luxor"],
        correctAnswer: "Cairo",
    }
];

export function SampleQuiz() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15); // 15 seconds for each question
    const [showConfetti, setShowConfetti] = useState(false);
    const [screenCracked, setScreenCracked] = useState(false);
    const [answerResult, setAnswerResult] = useState(null);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

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

    const handleTimeExpired = () => {
        setAnswerResult("Time's up!");
        setScreenCracked(true);

        setTimeout(() => {
            setScreenCracked(false);
            nextQuestion();
        }, 2000);
    };

    const handleNextQuestion = () => {
        const currentQuestion = sampleQuestions[currentQuestionIndex];
        if (currentQuestion.correctAnswer === selectedAnswer) {
            setScore(score + 1);
            setAnswerResult("Correct Answer!");
            setShowConfetti(true);
            setScreenCracked(false);
        } else {
            setAnswerResult("Wrong Answer!");
            setShowConfetti(false);
            setScreenCracked(true);
        }

        setTimeout(() => {
            setShowConfetti(false);
            setScreenCracked(false);
            setAnswerResult(null);
            nextQuestion();
        }, 2000);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < sampleQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer("");
            setTimeLeft(15); // Reset the timer for the next question
        } else {
            setIsQuizFinished(true);
        }
    };

    const calculateDashOffset = () => {
        const maxTime = 15; // Maximum time per question
        const dashArray = 283; // Total length of the circle's perimeter
        const dashOffset = (dashArray * timeLeft) / maxTime;
        return dashOffset;
    };

    return (
        <div className={`p-8 dark:bg-gray-900 dark:text-yellow-100 ${screenCracked ? "cracked-screen" : ""}`}>
            {isQuizFinished ? (
                <Card className="p-6 bg-yellow-100 dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-xl border-4 border-red-500">
                    <Typography variant="h5" className="text-center text-blue-800 font-bold">
                        🎉 Quiz Finished! Your Score: {score}/{sampleQuestions.length}
                    </Typography>
                    <Button
                        variant="gradient"
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md text-lg mt-6"
                        onClick={() => window.location.reload()} // Reset quiz
                    >
                        Restart Quiz
                    </Button>
                </Card>
            ) : (
                <Card className="p-8 bg-yellow-100 dark:bg-gray-800 dark:border-gray-700 border border-black rounded-lg shadow-lg">
                    <Typography
                        variant="h5"
                        className="mb-6 text-blue-800 dark:text-yellow-300 font-bold border-b border-gray-300 dark:border-gray-600 pb-2"
                    >
                        Question {currentQuestionIndex + 1}
                    </Typography>
                    <Typography variant="paragraph" className="mb-6 text-gray-900 dark:text-gray-200">
                        {sampleQuestions[currentQuestionIndex].text}
                    </Typography>
                    {sampleQuestions[currentQuestionIndex].answers.map((answer, index) => (
                        <label key={index} className="flex items-center mb-4 text-gray-900 dark:text-gray-200">
                            <input
                                type="radio"
                                value={answer}
                                checked={selectedAnswer === answer}
                                onChange={() => setSelectedAnswer(answer)}
                                className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                            />
                            <Typography className="ml-3">{answer}</Typography>
                        </label>
                    ))}
                    {showConfetti && <Confetti />}
                    {answerResult && (
                        <Typography
                            variant="paragraph"
                            className={`mt-4 mb-4 text-lg font-bold animate__animated ${
                                answerResult === "Correct Answer!" ? "text-green-500 animate__bounceIn" : "text-red-500 animate__shakeX"
                            }`}
                        >
                            {answerResult}
                        </Typography>
                    )}

                    <div className="mt-4 mb-4 flex flex-col items-center relative">
                        <div className="relative">
                            <svg
                                width="100"
                                height="100"
                                className="timer-circle"
                                style={{ transform: "rotate(-90deg)" }} // Start from the top
                            >
                                <circle
                                    r="45"
                                    cx="50"
                                    cy="50"
                                    stroke="#4A90E2"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray="283"
                                    strokeDashoffset={calculateDashOffset()}
                                    style={{ transition: "stroke-dashoffset 1s linear" }} // Smooth transition
                                />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <Typography className="text-red-600 font-bold text-2xl">
                                    {timeLeft}s
                                </Typography>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="gradient"
                        color="blue"
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg border border-black dark:border-yellow-300"
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                    >
                        {currentQuestionIndex < sampleQuestions.length - 1 ? "Next" : "Finish"}
                    </Button>
                </Card>
            )}
        </div>
    );
}

export default SampleQuiz;
