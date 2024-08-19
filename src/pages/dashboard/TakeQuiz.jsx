import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Radio } from "@material-tailwind/react";
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
        <div className="p-6">
            {quiz ? (
                <Card className="p-6">
                    <Typography variant="h5" className="mb-4">Question {currentQuestionIndex + 1}</Typography>
                    <Typography variant="paragraph" className="mb-4">{quiz.questions[currentQuestionIndex].text}</Typography>
                    {quiz.questions[currentQuestionIndex].answers.map((answer, index) => (
                        <Radio
                            key={index}
                            label={answer}
                            value={answer}
                            checked={selectedAnswer === answer}
                            onChange={() => setSelectedAnswer(answer)}
                            className="mb-2"
                        />
                    ))}
                    <Button
                        variant="gradient"
                        color="blue"
                        className="mt-4"
                        onClick={handleNextQuestion}
                    >
                        {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
                    </Button>
                </Card>
            ) : (
                <Typography>Loading...</Typography>
            )}
        </div>
    );
}

export default TakeQuiz;
