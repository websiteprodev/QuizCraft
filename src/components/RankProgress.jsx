import React, { useEffect, useState } from "react";
import { fetchUserRankAndProgress } from "@/services/quizService";
import { Typography, Card } from "@material-tailwind/react";
import { useAuth } from "../pages/auth/AuthContext";

export function RankProgress() {
    const [rankInfo, setRankInfo] = useState(null);
    const { user } = useAuth(); 

    useEffect(() => {
        const fetchRankData = async () => {
            if (user && user.username) { 
                try {
                    const data = await fetchUserRankAndProgress(user.username);
                    setRankInfo(data);
                } catch (error) {
                    console.error("Error fetching rank and progress:", error);
                }
            } else {
                console.log("User not logged in or user data is incomplete");
            }
        };

        fetchRankData();
    }, [user]); // Добавяне на user като зависимост за useEffect

    if (!rankInfo) {
        return <Typography>Loading rank and progress...</Typography>;
    }

    return (
        <Card className="p-6 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-lg">
            <Typography variant="h5" className="mb-4">
                Rank: {rankInfo.rank}
            </Typography>
            <Typography variant="h6" className="mb-4">
                Points: {rankInfo.points}
            </Typography>
            <Typography variant="paragraph" className="text-gray-500 dark:text-gray-400">
                Progress to next rank: {rankInfo.nextRankProgress}%
            </Typography>
            <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${rankInfo.nextRankProgress}%` }}
                >
                    {rankInfo.nextRankProgress}%
                </div>
            </div>
        </Card>
    );
}

export default RankProgress;
