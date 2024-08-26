import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Typography, Button, Input } from "@material-tailwind/react";

export function TestManagement() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            const testsSnapshot = await getDocs(collection(db, "quizzes"));
            const testsList = testsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTests(testsList);
        };

        fetchTests();
    }, []);

    const handleDeleteTest = async (testId) => {
        try {
            await deleteDoc(doc(db, "quizzes", testId));
            setTests((prevTests) => prevTests.filter((test) => test.id !== testId));
        } catch (error) {
            console.error("Error deleting test: ", error);
        }
    };

    const handleEditTest = async (testId, updatedTest) => {
        try {
            const testDocRef = doc(db, "quizzes", testId);
            await updateDoc(testDocRef, updatedTest);
            setTests((prevTests) =>
                prevTests.map((test) => (test.id === testId ? { ...test, ...updatedTest } : test))
            );
        } catch (error) {
            console.error("Error editing test: ", error);
        }
    };

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">Test Management</Typography>
            <div className="grid gap-4">
                {tests.map((test) => (
                    <div key={test.id} className="flex justify-between items-center">
                        <div>
                            <Typography variant="h6">{test.title}</Typography>
                            <Typography variant="body2">{test.category}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="gradient"
                                color="blue"
                                onClick={() => handleEditTest(test.id, { title: "Updated Title" })} // Примерно обновление
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="red"
                                onClick={() => handleDeleteTest(test.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestManagement;
