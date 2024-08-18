import React from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/configs/firebase"; 

export function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", answers: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", answers: ["", "", "", ""], correctAnswer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        return;
      }
      await addDoc(collection(db, "quizzes"), {
        title,
        category,
        numberOfQuestions: questions.length,
        questions,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setTitle("");
      setCategory("");
      setQuestions([{ text: "", answers: ["", "", "", ""], correctAnswer: "" }]);
      setSuccessMessage("You created a new quiz successfully!");
    } catch (e) {
      console.error("Error adding quiz: ", e);
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <Typography variant="h6" color="green" className="mb-4">
          {successMessage}
        </Typography>
      )}
      <Typography variant="h4" className="mb-4">Create a New Quiz</Typography>
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6">
              <Input
                label={`Question ${qIndex + 1}`}
                value={question.text}
                onChange={(e) => handleInputChange(qIndex, e.target.value)}
                className="mb-4"
              />
              {question.answers.map((answer, aIndex) => (
                <Input
                  key={aIndex}
                  label={`Answer ${aIndex + 1}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                  className="mb-2"
                />
              ))}
              <Input
                label="Correct Answer"
                value={question.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                className="mb-4"
              />
            </div>
          ))}
          <Button type="button" onClick={addQuestion} className="mb-4">
            Add Another Question
          </Button>
          <Button type="submit" color="blue">
            Create Quiz
          </Button>
        </form>
      </Card>
    </div>
  );
}  

export default CreateQuiz;

