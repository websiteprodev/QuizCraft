
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom"; 
import { db } from "@/configs/firebase";
import { Typography, Button } from "@material-tailwind/react";

export function TestManagement() {
    const [tests, setTests] = useState([]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const testsSnapshot = await getDocs(collection(db, "quizzes"));
                const testsList = testsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTests(testsList);
            } catch (error) {
                console.error("Error fetching tests: ", error);
            }
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

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">Test Management</Typography>
            <div className="grid gap-4">
                {tests.map((test) => (
                    <div key={test.id} className="flex justify-between items-center p-4 border rounded-lg shadow-md">
                        <div>
                            <Typography variant="h5">{test.title}</Typography>
                            <Typography variant="paragraph">{test.category}</Typography>
                        </div>
                        <div className="flex gap-2">
                            <Link to={`/admin/edit-quiz/${test.id}`}>
                                <Button variant="gradient" color="blue">
                                    Edit
                                </Button>
                            </Link>
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
