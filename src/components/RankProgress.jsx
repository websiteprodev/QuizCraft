import React, { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { fetchUserRankAndProgress } from "@/services/quizService";
import { useAuth } from "../pages/auth/AuthContext";

// Define score ranges and rank titles
const ScoreRangeEnum = {
    BEGINNER: 1000,
    FLEDGLING: 2000,
    APPRENTICE: 3000,
    SCHOLAR: 4000,
    VETERAN: 5000,
    PROPHET: 6000,
    EXPERT: 7000,
    GRAND_EXPERT: 8000,
    MASTER: 9000,
    GRAND_MASTER: 10000,
};

const RankTitleEnum = {
    BEGINNER: "Beginner",
    FLEDGLING: "Fledgling",
    APPRENTICE: "Apprentice",
    SCHOLAR: "Scholar",
    VETERAN: "Veteran",
    PROPHET: "Prophet",
    EXPERT: "Expert",
    GRAND_EXPERT: "Grand Expert",
    MASTER: "Master",
    GRAND_MASTER: "Grand Master",
    LEGEND: "Legend",
};

// Function to get rank by points
const getRankByPoints = (points) => {
    switch (true) {
        case points <= ScoreRangeEnum.BEGINNER:
            return RankTitleEnum.BEGINNER;
        case points <= ScoreRangeEnum.FLEDGLING:
            return RankTitleEnum.FLEDGLING;
        case points <= ScoreRangeEnum.APPRENTICE:
            return RankTitleEnum.APPRENTICE;
        case points <= ScoreRangeEnum.SCHOLAR:
            return RankTitleEnum.SCHOLAR;
        case points <= ScoreRangeEnum.VETERAN:
            return RankTitleEnum.VETERAN;
        case points <= ScoreRangeEnum.PROPHET:
            return RankTitleEnum.PROPHET;
        case points <= ScoreRangeEnum.EXPERT:
            return RankTitleEnum.EXPERT;
        case points <= ScoreRangeEnum.GRAND_EXPERT:
            return RankTitleEnum.GRAND_EXPERT;
        case points <= ScoreRangeEnum.MASTER:
            return RankTitleEnum.MASTER;
        case points <= ScoreRangeEnum.GRAND_MASTER:
            return RankTitleEnum.GRAND_MASTER;
        default:
            return RankTitleEnum.LEGEND;
    }
};

export function RankProgress() {
    const [rankInfo, setRankInfo] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRankData = async () => {
            if (user && user.username) {
                try {
                    const data = await fetchUserRankAndProgress(user.username);
                    setRankInfo({
                        ...data,
                        rank: getRankByPoints(data.points) // Using function to get rank by points
                    });
                } catch (error) {
                    console.error("Error fetching rank and progress:", error);
                }
            } else {
                console.log("User not logged in or user data is incomplete");
            }
        };

        fetchRankData();
    }, [user]);

    if (!rankInfo) {
        return <Typography>Loading rank and progress...</Typography>;
    }

    return (
        <Card className="bg-white dark:bg-gray-900 border-4 border-yellow-400 dark:border-gray-700 rounded-lg">
            <CardHeader
                variant="gradient"
                className="mb-8 p-6 bg-gradient-to-r from-blue-400 to-yellow-400 dark:from-gray-700 dark:to-gray-800 text-white text-center"
            >
                <Typography
                    variant="h6"
                    className="text-white text-3xl font-extrabold"
                    style={{ 
                        fontFamily: "'Comic Sans MS', cursive, sans-serif",
                        textShadow: "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black" 
                    }}
                >
                    Rank and Progress 🚀
                </Typography>
            </CardHeader>
            <CardBody className="p-4 text-center">
                <Typography
                    variant="h5"
                    className="mb-4 text-yellow-600 dark:text-yellow-400 font-bold"
                    style={{ 
                        fontFamily: "'Comic Sans MS', cursive, sans-serif",
                        textShadow: "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black"
                    }}
                >
                    Rank: {rankInfo.rank} ({rankInfo.points} points)
                </Typography>
                <Typography
                    variant="paragraph"
                    className="text-blue-700 dark:text-blue-300 font-medium mb-2"
                >
                    Progress to next rank: {rankInfo.nextRankProgress}%
                </Typography>
                <div className="w-full bg-yellow-200 dark:bg-gray-700 rounded-full shadow-lg mb-4">
                    <div
                        className="bg-red-500 text-xs font-bold text-white text-center p-1 leading-none rounded-full transition-all duration-300 ease-in-out"
                        style={{
                            width: `${rankInfo.nextRankProgress}%`,
                            textShadow: "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black"
                        }}
                    >
                        {rankInfo.nextRankProgress}%
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default RankProgress;
