import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Card, Typography } from "@material-tailwind/react";
import './Scoreboard.css'; // Импортируйте файл стилей

export function Scoreboard({ quizId }) {
    const [scores, setScores] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const q = query(collection(db, "scoreboard"), where("quizId", "==", quizId));
                const querySnapshot = await getDocs(q);
                const fetchedScores = [];
                querySnapshot.forEach((doc) => {
                    fetchedScores.push(doc.data());
                });
                setScores(fetchedScores.sort((a, b) => b.score - a.score));
            } catch (e) {
                console.error("Error fetching scores: ", e.message);
                setError("Failed to load scores. Please check your permissions.");
            }
        };

        fetchScores();
    }, [quizId]);

    return (
        <Card className="p-6 bg-blue-200 border border-yellow-400 shadow-lg rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <img src="/path-to-stars-background.png" alt="Stars" className="w-full h-full object-cover opacity-20" />
            </div>
            <Typography variant="h4" className="mb-4 text-yellow-600 font-bold text-center relative z-10">
                Scoreboard
            </Typography>
            {error ? (
                <Typography color="red" className="text-center">{error}</Typography>
            ) : scores.length > 0 ? (
                <div className="space-y-2">
                    {scores.map((score, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-md border border-yellow-300">
                            <Typography variant="h6" className="text-blue-800">{score.userId}</Typography>
                            <Typography variant="h6" className="text-red-500">{score.score}</Typography>
                        </div>
                    ))}
                </div>
            ) : (
                <Typography variant="h6" className="text-center">No scores available.</Typography>
            )}
        </Card>
    );
}

export default Scoreboard;
