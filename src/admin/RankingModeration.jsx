import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Table } from "@material-tailwind/react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/configs/firebase";

function RankingModeration() {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const fetchRankings = async () => {
            const rankingsSnapshot = await getDocs(collection(db, "rankings"));
            setRankings(rankingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchRankings();
    }, []);

    const handleDeleteRanking = async (rankingId) => {
        await deleteDoc(doc(db, "rankings", rankingId));
        setRankings(rankings.filter(ranking => ranking.id !== rankingId));
    };

    return (
        <Card>
            <Typography variant="h5" className="mb-4">Ranking Moderation</Typography>
            <Table>
                {/* Table header and rows with actions */}
            </Table>
        </Card>
    );
}

export default RankingModeration;
