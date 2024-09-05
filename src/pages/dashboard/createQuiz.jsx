import React, { useState, useEffect } from "react";
import { Card, Input, Button, Typography, Switch, Select, Option } from "@material-tailwind/react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/configs/firebase";
import { generateQuestion } from "@/services/gptService";

export function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", type: "multiple-choice", answers: ["", "", "", ""], correctAnswer: "1", points: 0 },
  ]);
  const [timer, setTimer] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
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
    setQuestions([...questions, { text: "", type: "multiple-choice", answers: ["", "", "", ""], correctAnswer: "1", points: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length < 3 || title.length > 30) {
      console.error("The title must be between 3 and 30 characters");
      return;
    }

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
        randomQuestions,
        createdBy: user.uid,
        createdAt: new Date(),
      });

      setTitle("");
      setCategory("");
      setQuestions([{ text: "", type: "multiple-choice", answers: ["", "", "", ""], correctAnswer: "1", points: 0 }]);
      setTimer(0);
      setTotalPoints(0);
      setRandomQuestions(false);
      setSuccessMessage("You have successfully created a new quiz!");
    } catch (e) {
      console.error("Error adding quiz: ", e);
    }
  };

  const generateAIQuestion = async () => {
    try {
      console.log(await generateQuestion("bulgarian"));
    } catch (error) {
      console.error("Error generating AI question:", error);
    }
  };

  return (
    <div className="p-6">
      {successMessage && (
        <Typography variant="h6" color="green" className="mb-4 text-green-500 dark:text-green-400">
          {successMessage}
        </Typography>
      )}
      <Typography variant="h4" className="mb-4 text-gray-900 dark:text-white">Create a New Quiz</Typography>
      <Card className="p-6 space-y-6 bg-white dark:bg-gray-800 dark:text-gray-200 shadow-lg rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Quiz Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 transition duration-300"
            />
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-pink-500 dark:focus:border-pink-500 transition duration-300"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Timer (in seconds)"
              type="number"
              value={timer}
              onChange={(e) => setTimer(Number(e.target.value))}
              className="mb-6 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 transition duration-300"
            />
            <Switch
              id="random-questions"
              label="Random Questions"
              checked={randomQuestions}
              onChange={(e) => setRandomQuestions(e.target.checked)}
              className="mb-6 text-gray-900 dark:text-gray-200"
            />
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 shadow-md">
              <Typography variant="h6" className="mb-4 text-gray-900 dark:text-gray-200">Question {qIndex + 1}</Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Question Type"
                  value={question.type}
                  onChange={(value) => handleQuestionTypeChange(qIndex, value)}
                  className="mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-300"
                >
                  <Option value="multiple-choice">Multiple Choice</Option>
                  <Option value="true-false">True/False</Option>
                  <Option value="short-answer">Short Answer</Option>
                </Select>
                <Input
                  label={`Question ${qIndex + 1}`}
                  value={question.text}
                  onChange={(e) => handleInputChange(qIndex, e.target.value)}
                  className="mb-4 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-500 transition duration-300"
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
                      className="mb-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-500 transition duration-300"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Correct Answer"
                  value={question.correctAnswer}
                  onChange={(value) => handleCorrectAnswerChange(qIndex, value)}
                  className="mb-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-500 transition duration-300"
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                </Select>
                <Input
                  label="Points for this question"
                  type="number"
                  value={question.points}
                  onChange={(e) => handlePointsChange(qIndex, e.target.value)}
                  className="mb-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-500 transition duration-300"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <Button type="button" onClick={addQuestion} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition duration-300 px-4 py-2">
              Add Another Question
            </Button>
            <Button type="button" onClick={generateAIQuestion} className="bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-300 px-4 py-2">
              Generate AI Question
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300 px-4 py-2"
            >
              Create Quiz
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateQuiz;
