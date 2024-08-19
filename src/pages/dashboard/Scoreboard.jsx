
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Card, Typography } from "@material-tailwind/react";

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
                setScores(fetchedScores.sort((a, b) => b.score - a.score)); // Sort by score in descending order
            } catch (e) {
                console.error("Error fetching scores: ", e.message);
                setError("Failed to load scores. Please check your permissions.");
            }
        };

        fetchScores();
    }, [quizId]);

    return (
        <Card className="p-6">
            <Typography variant="h4" className="mb-4">Scoreboard</Typography>
            {error ? (
                <Typography color="red">{error}</Typography>
            ) : scores.length > 0 ? (
                scores.map((score, index) => (
                    <div key={index} className="flex justify-between">
                        <Typography variant="h6">{score.userId}</Typography>
                        <Typography variant="h6">{score.score}</Typography>
                    </div>
                ))
            ) : (
                <Typography variant="h6">No scores available.</Typography>
            )}
        </Card>
    );
}

export default Scoreboard;
