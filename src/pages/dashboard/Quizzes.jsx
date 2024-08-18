import React from "react";
import { Card, Typography } from "@material-tailwind/react";

export function Quizzes() {
  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">Your Quizzes</Typography>
      <Card className="p-6">
        <Typography variant="h6" className="mb-2">Quiz 1</Typography>
        <Typography variant="paragraph">Category: Math</Typography>
        <Typography variant="paragraph">Questions: 10</Typography>
        <hr className="my-4"/>
        <Typography variant="h6" className="mb-2">Quiz 2</Typography>
        <Typography variant="paragraph">Category: Science</Typography>
        <Typography variant="paragraph">Questions: 15</Typography>
      </Card>
    </div>
  );
}

export default Quizzes;
