import React, { useState, useEffect } from "react";
import { Card, Input, Typography, Button } from "@material-tailwind/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { useNavigate } from "react-router-dom";

export function BrowseQuizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const quizzesSnapshot = await getDocs(collection(db, "quizzes"));
                setQuizzes(quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        fetchQuizzes();
    }, []);

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">Browse Quizzes</Typography>
            <Input
                label="Search Quizzes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6"
            />
            {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="p-4 mb-4">
                        <Typography variant="h6" className="mb-2">{quiz.title}</Typography>
                        <Typography variant="paragraph" color="gray">Category: {quiz.category}</Typography>
                        <Typography variant="paragraph" color="gray">Questions: {quiz.numberOfQuestions}</Typography>
                        <Button
                            variant="gradient"
                            color="blue"
                            className="mt-4"
                            onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                        >
                            Take Quiz
                        </Button>
                    </Card>
                ))
            ) : (
                <Typography>No quizzes found.</Typography>
            )}
        </div>
    );
}

export default BrowseQuizzes;
