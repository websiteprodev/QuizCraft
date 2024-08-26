import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Typography, Button, Input } from "@material-tailwind/react";

export function RankingModeration() {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const fetchRankings = async () => {
            const rankingsSnapshot = await getDocs(collection(db, "rankings"));
            const rankingsList = rankingsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRankings(rankingsList);
        };

        fetchRankings();
    }, []);

    const handleAdjustScore = async (rankingId, adjustment) => {
        try {
            const rankingDocRef = doc(db, "rankings", rankingId);
            await updateDoc(rankingDocRef, {
                score: adjustment, 
            });
            setRankings((prevRankings) =>
                prevRankings.map((ranking) =>
                    ranking.id === rankingId ? { ...ranking, score: adjustment } : ranking
                )
            );
        } catch (error) {
            console.error("Error adjusting score: ", error);
        }
    };

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">Ranking Moderation</Typography>
            <div className="grid gap-4">
                {rankings.map((ranking) => (
                    <div key={ranking.id} className="flex justify-between items-center">
                        <div>
                            <Typography variant="h6">{ranking.userId}</Typography>
                            <Typography variant="body2">Score: {ranking.score}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                label="New Score"
                                onChange={(e) => handleAdjustScore(ranking.id, parseInt(e.target.value))}
                                className="w-24"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RankingModeration;
