import React, { useState, useEffect } from "react";
import { Card, Input, Typography, Button } from "@material-tailwind/react";
import { fetchQuizzes, fetchTopScores } from "@/services/quizService";
import { useNavigate } from "react-router-dom";
import { PlayIcon, ChartBarIcon, TrophyIcon } from "@heroicons/react/24/solid";
import RankProgress from "@/components/RankProgress";
import { useAuth } from "../auth/AuthContext";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { createApi } from "unsplash-js"; 

export function BrowseQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [topScores, setTopScores] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [completedQuizzes, setCompletedQuizzes] = useState([]); // Store completed quizzes
    const [userPoints, setUserPoints] = useState(0); // Store user points
    const [categoryImages, setCategoryImages] = useState({}); // Store images per category
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user info from AuthContext

    const unsplash = createApi({
        accessKey: "dHCJ5jtF9xvP_6VQq3XeqR5dPpHTuBwxiWbRGwAPLiE",
    });

    useEffect(() => {
        const loadQuizzesAndUserData = async () => {
            try {
                // Fetch all quizzes
                const quizzesData = await fetchQuizzes();
                setQuizzes(quizzesData);

                // Fetch completed quizzes and user points for the current user from Firestore
                const db = getFirestore();
                const userDoc = doc(db, "users", user?.uid); // Reference to the user's document
                const userSnap = await getDoc(userDoc);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setCompletedQuizzes(userData.completedQuizzes || []); // Save completed quizzes array
                    setUserPoints(userData.points || 0); // Save user points
                } else {
                    console.log("No such user document!");
                }

                const fetchImages = async () => {
                    const images = {};
                    for (const quiz of quizzesData) {
                        if (!images[quiz.category]) {
                            const result = await unsplash.search.getPhotos({
                                query: quiz.category,
                                perPage: 1,
                            });
                            images[quiz.category] = result.response.results[0]?.urls.small || null;
                        }
                    }
                    setCategoryImages(images);
                };

                fetchImages();
            } catch (error) {
                console.error("Error fetching quizzes or user data:", error);
            }
        };
        loadQuizzesAndUserData();
    }, [user]);

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

    // Filter quizzes based on search term
    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 dark:text-gray-100">
            {/* Pass the user's points to RankProgress */}
            <RankProgress points={userPoints} />

            <Typography variant="h4" className="mb-4 dark:text-gray-100">Browse Quizzes</Typography>
            <Input
                label="Search Quizzes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 dark:bg-gray-700 dark:text-gray-200 rounded-lg"
            />

            {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="p-6 mb-4 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transform transition-all hover:scale-105 hover:shadow-xl">
                        <img
                            src={categoryImages[quiz.category] || "/default-placeholder.png"}
                            alt={quiz.title}
                            style={{ height: "17rem" }} 
                            className="w-full object-cover mb-4 rounded-lg shadow-md"
                        />
                        <Typography variant="h6" className="mb-2 dark:text-gray-100 font-bold">{quiz.title}</Typography>
                        <Typography variant="paragraph" className={`text-${getColorForCategory(quiz.category)} mb-2`}>
                            Category: {quiz.category}
                        </Typography>
                        <Typography variant="paragraph" color="gray" className="dark:text-gray-400">
                            Questions: {quiz.numberOfQuestions}
                        </Typography>
                        <Typography variant="paragraph" color="gray" className="dark:text-gray-400">
                            Created By: {quiz.createdBy}
                        </Typography>
                        <div className="mt-4 flex gap-4">
                            <Button
                                variant="gradient"
                                color={completedQuizzes.includes(quiz.id) ? "gray" : "blue"} // Check if the quiz is completed
                                className="dark:bg-blue-800 dark:text-gray-100 flex items-center"
                                disabled={completedQuizzes.includes(quiz.id)} // Disable if completed
                                onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                            >
                                <PlayIcon className="h-5 w-5 mr-2" />
                                {completedQuizzes.includes(quiz.id) ? 'Completed' : 'Start Quiz'} {/* Display proper text */}
                            </Button>

                            <Button
                                variant="gradient"
                                color="green"
                                className="dark:bg-green-800 dark:text-gray-100 flex items-center"
                                onClick={() => handleShowScoreboard(quiz.id)}
                            >
                                <ChartBarIcon className="h-5 w-5 mr-2" />
                                View Scoreboard
                            </Button>
                        </div>
                    </Card>
                ))
            ) : (
                <Typography className="dark:text-gray-400">No quizzes found.</Typography>
            )}

            {/* Scoreboard Modal */}
            {showScoreboard && <ScoreboardModal topScores={topScores} setShowScoreboard={setShowScoreboard} />}
        </div>
    );
}

export default BrowseQuizzes;

function getColorForCategory(category) {
    switch (category.toLowerCase()) {
        case 'math':
            return 'yellow-500';
        case 'science':
            return 'green-500';
        case 'history':
            return 'red-500';
        default:
            return 'blue-500';
    }
}

function ScoreboardModal({ topScores, setShowScoreboard }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg relative animate-fade-in-up max-w-lg w-full">
                <Typography variant="h4" className="mb-6 dark:text-gray-100 text-center flex items-center justify-center">
                    Top 10 Scores
                </Typography>
                {topScores.length > 0 ? (
                    <ul className="space-y-4">
                        {topScores.map((score, index) => (
                            <li key={index} className="dark:text-gray-300 flex justify-between items-center">
                                {index === 0 && <TrophyIcon className="h-8 w-8 text-yellow-400 mr-2" />}
                                {index === 1 && <TrophyIcon className="h-8 w-8 text-gray-400 mr-2" />}
                                {index === 2 && <TrophyIcon className="h-8 w-8 text-orange-400 mr-2" />}
                                <span className="font-medium text-lg">{index + 1}. {score.username}</span>
                                <span className="font-bold text-xl">{score.score} pts</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography className="dark:text-gray-400">No scores available.</Typography>
                )}
                <Button
                    variant="gradient"
                    color="red"
                    className="mt-6 w-full hover:bg-red-700 transition-colors"
                    onClick={() => setShowScoreboard(false)}
                >
                    Close
                </Button>
            </div>
        </div>
    );
}
