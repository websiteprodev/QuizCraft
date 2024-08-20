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
        <div className="p-6  dark:text-gray-100">
            <Typography variant="h4" className="mb-4 dark:text-gray-100">Browse Quizzes</Typography>
            <Input
                label="Search Quizzes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-6 dark:bg-gray-700 dark:text-gray-200"
            />
            {filteredQuizzes.length > 0 ? (
                filteredQuizzes.map((quiz) => (
                    <Card key={quiz.id} className="p-4 mb-4 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                        <Typography variant="h6" className="mb-2 dark:text-gray-100">{quiz.title}</Typography>
                        <Typography variant="paragraph" color="gray" className="dark:text-gray-400">
                            Category: {quiz.category}
                        </Typography>
                        <Typography variant="paragraph" color="gray" className="dark:text-gray-400">
                            Questions: {quiz.numberOfQuestions}
                        </Typography>
                        <Button
                            variant="gradient"
                            color="blue"
                            className="mt-4 dark:bg-blue-800 dark:text-gray-100"
                            onClick={() => navigate(`/dashboard/quiz/${quiz.id}`)}
                        >
                            Take Quiz
                        </Button>
                    </Card>
                ))
            ) : (
                <Typography className="dark:text-gray-400">No quizzes found.</Typography>
            )}
        </div>
    );
}

export default BrowseQuizzes;
