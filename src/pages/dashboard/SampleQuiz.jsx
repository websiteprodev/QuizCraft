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
        <div className="p-8 dark:bg-gray-900 dark:text-yellow-100">
            <Card className="p-8 bg-yellow-100 dark:bg-gray-800 dark:border-gray-700 border border-black rounded-lg shadow-lg">
                <Typography
                    variant="h5"
                    className="mb-6 text-blue-800 dark:text-yellow-300 font-bold border-b border-gray-300 dark:border-gray-600 pb-2"
                >
                    Question {currentQuestionIndex + 1}
                </Typography>
                <Typography
                    variant="paragraph"
                    className="mb-6 text-gray-900 dark:text-gray-200"
                >
                    {sampleQuestions[currentQuestionIndex].text}
                </Typography>
                {sampleQuestions[currentQuestionIndex].answers.map((answer, index) => (
                    <label
                        key={index}
                        className="flex items-center mb-4 text-gray-900 dark:text-gray-200"
                    >
                        <Radio
                            value={answer}
                            checked={selectedAnswer === answer}
                            onChange={() => setSelectedAnswer(answer)}
                            className="mr-3 text-blue-600 dark:text-yellow-400"
                        />
                        <Typography>{answer}</Typography>
                    </label>
                ))}
                <Button
                    variant="gradient"
                    color="blue"
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg border border-black dark:border-yellow-300"
                    onClick={handleNextQuestion}
                >
                    {currentQuestionIndex < sampleQuestions.length - 1 ? "Next" : "Finish"}
                </Button>
            </Card>
        </div>
    );
}

export default SampleQuiz;
