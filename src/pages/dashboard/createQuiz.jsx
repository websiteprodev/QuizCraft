import React from "react";
import { Card, Input, Button, Typography } from "@material-tailwind/react";

export function CreateQuiz() {
  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-4">Create a New Quiz</Typography>
      <Card className="p-6">
        <form>
          <div className="mb-4">
            <Input label="Quiz Title" />
          </div>
          <div className="mb-4">
            <Input label="Category" />
          </div>
          <div className="mb-4">
            <Input label="Number of Questions" type="number" />
          </div>
          <Button type="submit" color="blue">Create Quiz</Button>
        </form>
      </Card>
    </div>
  );
}

export default CreateQuiz;
