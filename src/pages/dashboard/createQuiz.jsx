import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography, Switch, Select, Option } from "@material-tailwind/react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/configs/firebase";

export function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", type: "multiple-choice", answers: ["", "", "", ""], correctAnswer: "", points: 0 },
  ]);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [totalPoints, setTotalPoints] = useState(0); // Total points
  const [randomQuestions, setRandomQuestions] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const total = questions.reduce((sum, question) => sum + question.points, 0);
    setTotalPoints(total);
  }, [questions]);

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

  const handlePointsChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].points = Number(value);
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].type = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: "", type: "multiple-choice", answers: ["", "", "", ""], correctAnswer: "", points: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 3 || title.length > 30) {
      console.error("The title must be between 3 and 30 characters");
      return;
    }

    // Check if the title already exists
    const querySnapshot = await getDocs(query(collection(db, "quizzes"), where("title", "==", title)));
    if (!querySnapshot.empty) {
      console.error("The title already exists");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not logged in");
        return;
      }
      
      await addDoc(collection(db, "quizzes"), {
        title,
        category,
        numberOfQuestions: questions.length,
        questions,
        timer,
        totalPoints,
        randomQuestions, // Променено поле
        createdBy: user.uid,
        createdAt: new Date(),
      });

      setTitle("");
      setCategory("");
      setQuestions([{ text: "", type: "multiple-choice", answers: ["", "", "", ""], correctAnswer: "", points: 0 }]);
      setTimer(0);
      setTotalPoints(0);
      setRandomQuestions(false); // Променено поле
      setSuccessMessage("You have successfully created a new quiz!");
    } catch (e) {
      console.error("Error adding quiz: ", e);
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <Typography variant="h6" color="green" className="mb-4 dark:text-green-400">
          {successMessage}
        </Typography>
      )}
      <Typography variant="h4" className="mb-4 dark:text-white-100">Create a New Quiz</Typography>
      <Card className="p-6 space-y-6 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 dark:bg-gray-700 dark:text-gray-200"
            />
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-4 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Timer (in seconds)"
              type="number"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              className="mb-6 dark:bg-gray-700 dark:text-gray-200"
            />
            <Switch
              id="random-questions"
              label="Random Questions"
              checked={randomQuestions}
              onChange={(e) => setRandomQuestions(e.target.checked)}
              className="mb-6 flex items-center dark:text-gray-200"
            />
          </div>

          {/* Questions Section */}
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded-lg space-y-4 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
              <Typography variant="h6" className="mb-4 dark:text-gray-200">Question {qIndex + 1}</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Question Type"
                  value={question.type}
                  onChange={(value) => handleQuestionTypeChange(qIndex, value)}
                  className="mb-4 dark:bg-gray-700 dark:text-gray-200"
                >
                  <Option value="multiple-choice">Multiple Choice</Option>
                  <Option value="true-false">True/False</Option>
                  <Option value="short-answer">Short Answer</Option>
                </Select>
                <Input
                  label={`Question ${qIndex + 1}`}
                  value={question.text}
                  onChange={(e) => handleInputChange(qIndex, e.target.value)}
                  className="mb-4 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
              {question.type === "multiple-choice" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {question.answers.map((answer, aIndex) => (
                    <Input
                      key={aIndex}
                      label={`Answer ${aIndex + 1}`}
                      value={answer}
                      onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                      className="mb-2 dark:bg-gray-700 dark:text-gray-200"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Correct Answer"
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                  className="mb-2 dark:bg-gray-700 dark:text-gray-200"
                />
                <Input
                  label="Points for this question"
                  type="number"
                  value={question.points}
                  onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                  className="mb-2 dark:bg-gray-700 dark:text-gray-200"
                />
              </div>
            </div>
          ))}

          {/* Buttons Section */}
          <div className="flex justify-between items-center">
            <Button type="button" onClick={addQuestion} className="mb-4 dark:bg-gray-700 dark:text-gray-200">
              Add Another Question
            </Button>
            <Button type="submit" color="blue" className="dark:bg-blue-800 dark:text-gray-200">
              Create Quiz
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateQuiz;