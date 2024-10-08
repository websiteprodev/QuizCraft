import React, { useState, useEffect } from 'react';
import {
    Card,
    Input,
    Typography,
    Button,
    Select,
    Option,
} from '@material-tailwind/react';
import {
    fetchQuizzes,
    fetchTopScores,
    subscribeToQuiz,
} from '@/services/quizService';
import { useNavigate } from 'react-router-dom';
import { PlayIcon, ChartBarIcon, TrophyIcon } from '@heroicons/react/24/solid';
import RankProgress from '@/components/RankProgress';
import { useAuth } from '../auth/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { createApi } from 'unsplash-js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

export function BrowseQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showScoreboard, setShowScoreboard] = useState(false);
    const [topScores, setTopScores] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const [userPoints, setUserPoints] = useState(0);
    const [categoryImages, setCategoryImages] = useState({});
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const [enrolledQuizzes, setEnrolledQuizzes] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Ongoing');
    const [currentPage, setCurrentPage] = useState(1);
    const quizzesPerPage = 9;
    const navigate = useNavigate();
    const { user } = useAuth();

    const unsplash = createApi({
        accessKey: 'dHCJ5jtF9xvP_6VQq3XeqR5dPpHTuBwxiWbRGwAPLiE',
    });

    useEffect(() => {
        const loadQuizzesAndUserData = async () => {
            try {
                const quizzesData = await fetchQuizzes();
                setQuizzes(quizzesData);

                const db = getFirestore();
                const userDoc = doc(db, 'users', user?.uid);
                const userSnap = await getDoc(userDoc);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setCompletedQuizzes(userData.completedQuizzes || []);
                    setUserPoints(userData.points || 0);
                    setEnrolledQuizzes(userData.subscribedQuizzes || []);
                }

                const fetchImages = async () => {
                    const images = {};
                    for (const quiz of quizzesData) {
                        if (!images[quiz.category]) {
                            const result = await unsplash.search.getPhotos({
                                query: quiz.category,
                                perPage: 1,
                            });
                            images[quiz.category] =
                                result.response.results[0]?.urls.small || null;
                        }
                    }
                    setCategoryImages(images);
                };

                fetchImages();
            } catch (error) {
                console.error('Error fetching quizzes or user data:', error);
            }
        };
        loadQuizzesAndUserData();
    }, [user]);

    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = quizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
    const totalPages = Math.ceil(quizzes.length / quizzesPerPage);

    // Determine quiz status (Finished, Ongoing, Future)
    const getQuizStatus = (startDate, endDate) => {
        const now = moment();
        const quizStart =
            startDate && typeof startDate.toDate === 'function'
                ? moment(startDate.toDate())
                : null;
        const quizEnd =
            endDate && typeof endDate.toDate === 'function'
                ? moment(endDate.toDate())
                : null;

        if (quizEnd && quizEnd.isBefore(now)) {
            return 'Finished';
        } else if (quizStart && quizStart.isAfter(now)) {
            return 'Future';
        } else {
            return 'Ongoing';
        }
    };

    const calculateRemainingTime = (endDate) => {
        if (!endDate || typeof endDate.toDate !== 'function') {
            return 'No end date set';
        }

        const now = moment();
        const quizEnd = moment(endDate.toDate());
        const duration = moment.duration(quizEnd.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();

        if (days > 0) {
            return `${days}d ${hours}h left`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m left`;
        } else {
            return `${minutes}m left`;
        }
    };
    const handleShowScoreboard = async (quizId) => {
        try {
            const scores = await fetchTopScores(quizId);
            setTopScores(scores);
            setSelectedQuizId(quizId);
            setShowScoreboard(true);
        } catch (error) {
            console.error('Error fetching top scores:', error);
        }
    };

    // Enroll user in quiz
    const handleEnroll = async (quizId) => {
        try {
            await subscribeToQuiz(user.uid, quizId); // Call to subscribeToQuiz
            setEnrolledQuizzes([...enrolledQuizzes, quizId]); // Update enrolled quizzes state
        } catch (error) {
            console.error('Error enrolling in quiz:', error);
        }
    };

    const filteredQuizzes = quizzes.filter((quiz) => {
        const quizStartDate = quiz.startDate?.toDate(); // Convert Firestore Timestamp to Date
        const quizEndDate = quiz.endDate?.toDate();
        const quizStatus = getQuizStatus(quizStartDate, quizEndDate);

        const matchesSearchTerm =
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if the quiz matches the search term and falls within the selected date range
        const withinDateRange =
            (!filterStartDate || quizStartDate >= filterStartDate) &&
            (!filterEndDate || quizEndDate <= filterEndDate);

        return matchesSearchTerm && withinDateRange;
    });

    // Handle showing review button for finished quizzes
    const renderQuizActions = (quiz) => {
        const status = getQuizStatus(quiz.startDate, quiz.endDate);
        const isEnrolled = enrolledQuizzes.includes(quiz.id);

        if (status === 'Ongoing') {
            return isEnrolled ? (
                <div className="alert alert-warning">
                    Time remaining: {calculateRemainingTime(quiz.endDate)}
                </div>
            ) : (
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={() => handleEnroll(quiz.id)}
                >
                    Enroll
                </Button>
            );
        }

        if (status === 'Finished') {
            return user.role === 'educator' ? (
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={() => navigate(`/quizzes/review/${quiz.id}`)}
                >
                    Review Answers
                </Button>
            ) : (
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={() => navigate(`/quizzes/results/${quiz.id}`)}
                >
                    View Results
                </Button>
            );
        }

        return null;
    };

    const paginationButtons = Array.from({ length: totalPages }, (_, i) => (
        <Button
            key={i + 1}
            variant="gradient"
            color={currentPage === i + 1 ? 'yellow' : 'blue'}
            onClick={() => setCurrentPage(i + 1)}
            className={`${
                currentPage === i + 1 ? 'bg-yellow-500' : 'bg-green-500'
            } hover:bg-yellow-500 mx-1 px-3 py-1 rounded-full`}
        >
            {i + 1}
        </Button>
    ));

    return (
        <div className="p-6 dark:text-gray-100">
            <RankProgress points={userPoints} />

            <Typography variant="h4" className="mb-4 text-grey-500 font-bold">
                Browse Quizzes
            </Typography>
            <Input
                label="Search Quizzes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 dark:bg-gray-700 dark:text-gray-200 rounded-lg border-4 border-blue-400"
            />
            <Select
                label="Filter by Status"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                className="mb-6 dark:bg-gray-700 dark:text-gray-200"
            >
                <Option value="Finished">Finished</Option>
                <Option value="Ongoing">Ongoing</Option>
                <Option value="Future">Future</Option>
            </Select>
            <div className="mb-6 flex gap-4">
                <div>
                    <label className="block mb-2 text-gray-900 dark:text-white">
                        Start Date
                    </label>
                    <DatePicker
                        selected={filterStartDate}
                        onChange={(date) => setFilterStartDate(date)}
                        className="w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                </div>
                <div>
                    <label className="block mb-2 text-gray-900 dark:text-white">
                        End Date
                    </label>
                    <DatePicker
                        selected={filterEndDate}
                        onChange={(date) => setFilterEndDate(date)}
                        className="w-full bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                </div>
            </div>

            {filteredQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredQuizzes.map((quiz) => (
                        <Card
                            key={quiz.id}
                            className="p-4 bg-yellow-100 shadow-xl rounded-lg border-4 border-red-500 hover:shadow-2xl transform transition-all hover:scale-105 dark:bg-gray-800 dark:border-yellow-500 dark:text-gray-200"
                        >
                            <img
                                src={
                                    categoryImages[quiz.category] ||
                                    '/default-placeholder.png'
                                }
                                alt={quiz.title}
                                style={{ height: '12rem' }}
                                className="w-full object-cover mb-4 rounded-lg shadow-md"
                            />
                            <Typography
                                variant="h6"
                                className="mb-2 text-blue-600 font-bold"
                            >
                                {quiz.title}
                            </Typography>
                            <Typography>
                                Status:{' '}
                                {getQuizStatus(quiz.startDate, quiz.endDate)}
                            </Typography>
                            {getQuizStatus(quiz.startDate, quiz.endDate) ===
                                'Ongoing' && (
                                <Typography className="text-red-500">
                                    {calculateRemainingTime(quiz.endDate)}
                                </Typography>
                            )}
                            {renderQuizActions(quiz)}
                            <Typography
                                variant="paragraph"
                                className={`text-green-600 font-bold mb-2`}
                            >
                                Category: {quiz.category}
                            </Typography>
                            <Typography
                                variant="paragraph"
                                className="text-gray-700 dark:text-gray-400"
                            >
                                Questions: {quiz.numberOfQuestions}
                            </Typography>
                            <Typography className="text-gray-700 dark:text-gray-400">
                                Created By: {quiz.createdBy}
                            </Typography>
                            <Typography className="text-gray-700 dark:text-gray-400">
                                Total Points: {quiz.totalPoints}
                            </Typography>
                            <div className="mt-4 flex justify-between">
                                <Button
                                    variant="gradient"
                                    color={
                                        completedQuizzes.includes(quiz.id)
                                            ? 'gray'
                                            : 'blue'
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                                    disabled={completedQuizzes.includes(
                                        quiz.id,
                                    )}
                                    onClick={() =>
                                        navigate(`/dashboard/quiz/${quiz.id}`)
                                    }
                                >
                                    <PlayIcon className="h-5 w-5 mr-2" />
                                    {completedQuizzes.includes(quiz.id)
                                        ? 'Completed'
                                        : 'Start Quiz'}
                                </Button>
                                {/* <Button
                                    variant="gradient"
                                    color={
                                        enrolledQuizzes.includes(quiz.id)
                                            ? 'gray'
                                            : 'blue'
                                    }
                                    className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                                    disabled={enrolledQuizzes.includes(quiz.id)}
                                    onClick={() => handleEnroll(quiz.id)}
                                >
                                    {enrolledQuizzes.includes(quiz.id)
                                        ? 'Participating'
                                        : 'Enroll'}
                                </Button> */}
                                <Button
                                    variant="gradient"
                                    color="red"
                                    className="bg-green-500 hover:bg-green-600 text-white rounded-full"
                                    onClick={() =>
                                        handleShowScoreboard(quiz.id)
                                    }
                                >
                                    <ChartBarIcon className="h-5 w-5 mr-2" />
                                    View Scores
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Typography className="dark:text-gray-400">
                    No quizzes found.
                </Typography>
            )}

            <div className="mt-6 flex justify-center">{paginationButtons}</div>

            {showScoreboard && (
                <ScoreboardModal
                    topScores={topScores}
                    setShowScoreboard={setShowScoreboard}
                />
            )}
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
                <Typography
                    variant="h4"
                    className="mb-6 dark:text-gray-100 text-center"
                >
                    Top 10 Scores
                </Typography>
                {topScores.length > 0 ? (
                    <ul className="space-y-4">
                        {topScores.map((score, index) => (
                            <li
                                key={index}
                                className="dark:text-gray-300 flex justify-between items-center"
                            >
                                {index === 0 && (
                                    <TrophyIcon className="h-8 w-8 text-yellow-400 mr-2" />
                                )}
                                {index === 1 && (
                                    <TrophyIcon className="h-8 w-8 text-gray-400 mr-2" />
                                )}
                                {index === 2 && (
                                    <TrophyIcon className="h-8 w-8 text-orange-400 mr-2" />
                                )}
                                <span className="font-medium text-lg">
                                    {index + 1}. {score.username}
                                </span>
                                <span className="font-bold text-xl">
                                    {score.score} pts
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <Typography className="dark:text-gray-400">
                        No scores available.
                    </Typography>
                )}
                <Button
                    variant="gradient"
                    color="red"
                    className="mt-6 w-full hover:bg-red-700 transition-colors rounded-full"
                    onClick={() => setShowScoreboard(false)}
                >
                    Close
                </Button>
            </div>
        </div>
    );
}
