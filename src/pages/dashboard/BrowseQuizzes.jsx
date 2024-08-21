import React, { useState, useEffect } from "react";
import { Card, Input, Typography, Button } from "@material-tailwind/react";
import { fetchQuizzes, fetchTopScores } from "@/services/quizService";  
import { useNavigate } from "react-router-dom";

export function BrowseQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [topScores, setTopScores] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const quizzesData = await fetchQuizzes();
                setQuizzes(quizzesData);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        loadQuizzes();
    }, []);

    const handleShowScoreboard = async (quizId) => {
        try {
            const scores = await fetchTopScores(quizId);
            setTopScores(scores);
            setSelectedQuizId(quizId);
            setShowScoreboard(true);
        } catch (error) {
            console.error("Error fetching top scores:", error);
        }
    };

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 dark:text-gray-100">
            <Typography variant="h4" className="mb-4 dark:text-gray-100">Browse Quizzes</Typography>
            <Input
                label="Search Quizzes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 dark:bg-gray-700 dark:text-gray-200"
            />
            {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="p-4 mb-4 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                        <Typography variant="h6" className="mb-2 dark:text-gray-100">{quiz.title}</Typography>
                        <Typography variant="paragraph" color="gray" className="dark:text-gray-400">
                            Category: {quiz.category}
                        </Typography>
                        <Typography variant="paragraph" color="gray" className="dark:text-gray-400">
                            Questions: {quiz.numberOfQuestions}
                        </Typography>
                        <div className="mt-4 flex gap-4">
                            <Button
                                variant="gradient"
                                color="blue"
                                className="dark:bg-blue-800 dark:text-gray-100"
                                onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                            >
                                Take Quiz
                            </Button>
                            <Button
                                variant="gradient"
                                color="green"
                                className="dark:bg-green-800 dark:text-gray-100"
                                onClick={() => handleShowScoreboard(quiz.id)}
                            >
                                View Scoreboard
                            </Button>
                        </div>
                    </Card>
                ))
            ) : (
                <Typography className="dark:text-gray-400">No quizzes found.</Typography>
            )}

            {showScoreboard && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
                        <Typography variant="h5" className="mb-4 dark:text-gray-100">Top 10 Scores</Typography>
                        {topScores.length > 0 ? (
                            <ul>
                                {topScores.map((score, index) => (
                                    <li key={index} className="dark:text-gray-300">
                                        {index + 1}. {score.username}: {score.score}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography className="dark:text-gray-400">No scores available.</Typography>
                        )}
                        <Button
                            variant="gradient"
                            color="red"
                            className="mt-4"
                            onClick={() => setShowScoreboard(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BrowseQuizzes;
