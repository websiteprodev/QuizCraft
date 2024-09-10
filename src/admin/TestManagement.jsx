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

    const handleSendInvitation = async (testId) => {
        try {
            console.log(`Invitations for test ${testId} sent.`);
            alert(`Invitations sent for test ${testId}`);
        } catch (error) {
            console.error("Error sending invitations: ", error);
        }
    };

    return (
        <div className="p-8 bg-blue-50 dark:bg-gray-900 min-h-screen">
            <Typography variant="h4" className="mb-6 text-blue-700 dark:text-yellow-300 font-bold">
                Test Management
            </Typography>
            <div className="grid gap-6">
                {tests.map((test) => (
                    <div
                        key={test.id}
                        className="flex justify-between items-center p-5 border-2 border-blue-300 dark:border-yellow-500 rounded-lg shadow-lg bg-white dark:bg-gray-800 transform transition-transform hover:scale-105"
                    >
                        <div>
                            <Typography variant="h5" className="text-blue-800 dark:text-yellow-200 font-semibold">
                                {test.title}
                            </Typography>
                            <Typography variant="paragraph" className="text-gray-700 dark:text-gray-300">
                                {test.category}
                            </Typography>
                        </div>
                        <div className="flex gap-3">
                            <Link to={`/test-management/edit/${test.id}`}>
                                <Button variant="gradient" color="blue" className="rounded-full">
                                    Edit
                                </Button>
                            </Link>
                            <Button
                                variant="outlined"
                                color="red"
                                className="rounded-full"
                                onClick={() => handleDeleteTest(test.id)}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="gradient"
                                color="green"
                                className="rounded-full"
                                onClick={() => handleSendInvitation(test.id)}
                            >
                                Send Invitation
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TestManagement;
