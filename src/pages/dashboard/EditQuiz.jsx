import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchQuizById, updateQuiz } from '@/services/quizService'; 

const EditQuiz = () => {
    const { id } = useParams(); 
    const [quiz, setQuiz] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const quizData = await fetchQuizById(id); 
                setQuiz(quizData);
                setTitle(quizData.title); 
            } catch (error) {
                console.error("Error fetching quiz:", error);
            }
        };

        loadQuiz();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await updateQuiz(id, { title }); 
            alert('Quiz updated successfully!');
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    if (!quiz) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Quiz</h2>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <button onClick={handleUpdate}>Update Title</button>
        </div>
    );
};

export default EditQuiz;
