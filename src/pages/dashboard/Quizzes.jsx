import React, { useState, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/configs/firebase";
import { Link } from "react-router-dom";

export function Quizzes() {
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [takenQuizzes, setTakenQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not logged in");
          return;
        }

        const createdQuizzesQuery = query(collection(db, "quizzes"), where("createdBy", "==", user.uid));
        const createdQuizzesSnapshot = await getDocs(createdQuizzesQuery);
        setCreatedQuizzes(createdQuizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const takenQuizzesQuery = query(collection(db, "quizzes"), where("scores." + user.uid, "!=", null));
        const takenQuizzesSnapshot = await getDocs(takenQuizzesQuery);
        const takenQuizzesData = takenQuizzesSnapshot.docs.map(doc => {
          const data = doc.data();
          const score = data.scores[user.uid] || 0; 
          return { id: doc.id, ...data, score };
        });
        setTakenQuizzes(takenQuizzesData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setCreatedQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== quizId));
      alert("Quiz deleted successfully!");
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">Your Quizzes</Typography>

      <Card className="p-6 mb-6">
        <Typography variant="h5" className="mb-4">Created Quizzes</Typography>
        {createdQuizzes.length > 0 ? (
          createdQuizzes.map(quiz => (
            <div key={quiz.id} className="mb-4">
              <Typography variant="h6">{quiz.title}</Typography>
              <Typography variant="paragraph">Category: {quiz.category}</Typography>
              <Typography variant="paragraph">Questions: {quiz.numberOfQuestions}</Typography>
              
              <div className="flex gap-2 mt-4">
                {/* Препращане към AdminEditQuiz.jsx с правилния quizId */}
                <Link to={`/quizzes/edit/${quiz.id}`}>
                  <Button variant="gradient" color="blue">Edit</Button>
                </Link>
                <Button variant="outlined" color="red" onClick={() => handleDeleteQuiz(quiz.id)}>
                  Delete
                </Button>
              </div>

              <hr className="my-4"/>
            </div>
          ))
        ) : (
          <Typography variant="paragraph">No quizzes created.</Typography>
        )}
      </Card>

      <Card className="p-6">
        <Typography variant="h5" className="mb-4">Taken Quizzes</Typography>
        {takenQuizzes.length > 0 ? (
          takenQuizzes.map(quiz => (
            <div key={quiz.id} className="mb-4">
              <Typography variant="h6">{quiz.title}</Typography>
              <Typography variant="paragraph">Category: {quiz.category}</Typography>
              <Typography variant="paragraph">Questions: {quiz.numberOfQuestions}</Typography>
              <Typography variant="paragraph">Your Score: {quiz.score}</Typography>
              <hr className="my-4"/>
            </div>
          ))
        ) : (
          <Typography variant="paragraph">No quizzes taken.</Typography>
        )}
      </Card>
    </div>
  );
}

export default Quizzes;
