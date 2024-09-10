import React, { useEffect, useState } from "react";
import { Typography, Card, CardHeader, CardBody, Button, Checkbox, List, ListItem } from "@material-tailwind/react";
import { collection, getDocs, query, where, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const addTeacherToGroup = async (groupId, teacherId) => {
    try {
        const groupRef = doc(db, "groups", groupId);
        await updateDoc(groupRef, {
            teachers: arrayUnion(teacherId)
        });
        console.log("Teacher added successfully!");
    } catch (error) {
        console.error("Error adding teachers to group:", error);
        alert("Failed to add teacher. Check your permissions.");
    }
};

export function GroupTeacherManagement({ groupId }) {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeachers, setSelectedTeachers] = useState([]);

    const fetchTeachers = async () => {
        const q = query(collection(db, "users"), where("role", "==", "teacher"));
        const querySnapshot = await getDocs(q);
        const teachersList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setTeachers(teachersList);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleTeacherSelect = (teacherId) => {
        setSelectedTeachers((prevSelected) =>
            prevSelected.includes(teacherId)
                ? prevSelected.filter(id => id !== teacherId)
                : [...prevSelected, teacherId]
        );
    };

    const handleAddTeachersToGroup = async () => {
        try {
            const groupDocRef = doc(db, "groups", groupId);

            await updateDoc(groupDocRef, {
                teachers: arrayUnion(...selectedTeachers),
            });

            toast.success("Teachers added to group successfully!");

            setSelectedTeachers([]);
            fetchTeachers();
        } catch (error) {
            toast.error("Failed to add teachers to group!");
            console.error("Error adding teachers to group: ", error);
        }
    };

    return (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-lg">
            <CardHeader className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-t-lg">
                <Typography variant="h5">Manage Group Teachers</Typography>
            </CardHeader>
            <CardBody className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                <List>
                    {teachers.map((teacher) => (
                        <ListItem key={teacher.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2 px-4">
                            <Typography variant="body1" className="text-gray-800 dark:text-gray-200">{teacher.name}</Typography>
                            <Checkbox
                                checked={selectedTeachers.includes(teacher.id)}
                                onChange={() => handleTeacherSelect(teacher.id)}
                                className="text-blue-500 dark:bg-blue-600 dark:border-blue-500"
                            />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={handleAddTeachersToGroup} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" color="blue">
                    Add Selected Teachers to Group
                </Button>
            </CardBody>
            <ToastContainer />
        </Card>
    );
}

export default GroupTeacherManagement;

