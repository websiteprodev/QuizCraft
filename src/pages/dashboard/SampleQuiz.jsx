import React, { useState } from "react";
import { Card, Button, Typography, Radio } from "@material-tailwind/react";

const sampleQuestions = [
    {
        text: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris",
    },
    {
        text: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correctAnswer: "4",
    },
];

export function SampleQuiz() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);

    const handleNextQuestion = () => {
        if (sampleQuestions[currentQuestionIndex].correctAnswer === selectedAnswer) {
            setScore(score + 1);
        }
        setSelectedAnswer("");
        if (currentQuestionIndex < sampleQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert(`Your score: ${score + 1}/${sampleQuestions.length}`);
            setCurrentQuestionIndex(0);
            setScore(0);
        }
    };

    return (
        <div className="p-6 dark:text-gray-100">
            <Card className="p-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                <Typography variant="h5" className="mb-4 dark:text-gray-100">Question {currentQuestionIndex + 1}</Typography>
                <Typography variant="paragraph" className="mb-4 dark:text-gray-200">{sampleQuestions[currentQuestionIndex].text}</Typography>
                {sampleQuestions[currentQuestionIndex].answers.map((answer, index) => (
                    <label key={index} className="flex items-center mb-2 dark:text-gray-200">
                        <input
                            type="radio"
                            value={answer}
                            checked={selectedAnswer === answer}
                            onChange={() => setSelectedAnswer(answer)}
                            className="mr-2 h-5 w-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
                        />
                        <Typography>{answer}</Typography>
                    </label>
                ))}
                <Button
                    variant="gradient"
                    color="blue"
                    className="mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-800 dark:text-gray-100"
                    onClick={handleNextQuestion}
                >
                    {currentQuestionIndex < sampleQuestions.length - 1 ? "Next" : "Finish"}
                </Button>
            </Card>
        </div>
    );
}

export default SampleQuiz;
