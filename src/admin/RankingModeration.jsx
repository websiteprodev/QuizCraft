import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Typography, Input, Button, Select, Option, Alert } from "@material-tailwind/react";
import { useAuth } from "@/pages/auth/AuthContext";

export function RankingModeration() {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [scoresByQuiz, setScoresByQuiz] = useState({});
    const [editedScores, setEditedScores] = useState({});
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchQuizzesAndScores = async () => {
            try {
                const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
                const quizzesList = quizzesSnapshot.docs.map((quizDoc) => ({
                    id: quizDoc.id,
                    title: quizDoc.data().title,
                }));
                setQuizzes(quizzesList);

                const scoresData = {};
                for (const quiz of quizzesList) {
                    const scoresSnapshot = await getDocs(
                        collection(db, "quizzes", quiz.id, "scores")
                    );
                    const scoresList = scoresSnapshot.docs.map((scoreDoc) => ({
                        id: scoreDoc.id,
                        ...scoreDoc.data(),
                    }));
                    scoresData[quiz.id] = scoresList;
                }
                setScoresByQuiz(scoresData);
            } catch (error) {
                console.error("Error fetching quizzes or scores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzesAndScores();
    }, []);

    const handleScoreChange = (quizId, scoreId, newScore) => {
        setEditedScores((prevEditedScores) => ({
            ...prevEditedScores,
            [quizId]: {
                ...prevEditedScores[quizId],
                [scoreId]: newScore,
            },
        }));
    };

    const handleUpdateScores = async () => {
        const updatedScores = editedScores[selectedQuizId] || {};

        for (const [scoreId, newScore] of Object.entries(updatedScores)) {
            try {
                const scoreDocRef = doc(db, "quizzes", selectedQuizId, "scores", scoreId);
                await updateDoc(scoreDocRef, {
                    score: parseInt(newScore),
                });

                setScoresByQuiz((prevScores) => ({
                    ...prevScores,
                    [selectedQuizId]: prevScores[selectedQuizId].map((score) =>
                        score.id === scoreId ? { ...score, score: parseInt(newScore) } : score
                    ),
                }));
            } catch (error) {
                console.error("Error updating score: ", error);
            }
        }

        setSuccessMessage("Scores updated successfully!");

        setTimeout(() => {
            setSuccessMessage(null);
        }, 3000);
    };

    if (loading) {
        return <div className="p-6">Loading quizzes and scores...</div>;
    }

    return (
        <div className="p-6 bg-yellow-50 dark:bg-gray-900 min-h-screen">
            <Typography variant="h4" className="mb-4 text-blue-700 dark:text-yellow-300 font-bold">
                Ranking Moderation
            </Typography>

            {successMessage && (
                <Alert color="green" className="mb-4">
                    {successMessage}
                </Alert>
            )}

            <Select
                label="Select a Quiz"
                value={selectedQuizId}
                onChange={(value) => setSelectedQuizId(value)}
                className="mb-6"
            >
                {quizzes.map((quiz) => (
                    <Option key={quiz.id} value={quiz.id}>
                        {quiz.title || "Untitled Quiz"}
                    </Option>
                ))}
            </Select>

            {selectedQuizId && scoresByQuiz[selectedQuizId] && scoresByQuiz[selectedQuizId].length > 0 ? (
                <div className="grid gap-4">
                    {scoresByQuiz[selectedQuizId].map((score) => (
                        <div key={score.id} className="flex justify-between items-center p-4 border-2 border-yellow-300 dark:border-yellow-500 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                            <div>
                                <Typography variant="h6" className="text-blue-800 dark:text-yellow-200 font-semibold">
                                    {score.username || "Anonymous"}
                                </Typography>
                                <Typography variant="paragraph" className="text-gray-700 dark:text-gray-300">
                                    Current Score: {score.score !== undefined ? score.score : "N/A"}
                                </Typography>
                            </div>
                            <div className="flex gap-2 items-center">
                                <Input
                                    type="number"
                                    label="New Score"
                                    defaultValue={score.score}
                                    onChange={(e) =>
                                        handleScoreChange(selectedQuizId, score.id, e.target.value)
                                    }
                                    className="w-24"
                                />
                            </div>
                        </div>
                    ))}
                    <Button
                        variant="gradient"
                        color="blue"
                        onClick={handleUpdateScores}
                        className="mt-4"
                    >
                        Update Scores
                    </Button>
                </div>
            ) : (
                <Typography variant="paragraph" className="text-gray-500 dark:text-gray-400">
                    No scores available for this quiz.
                </Typography>
            )}
        </div>
    );
}

export default RankingModeration;
