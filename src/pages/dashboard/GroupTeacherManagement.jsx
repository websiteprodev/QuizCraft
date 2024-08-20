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
        <Card>
            <CardHeader>
                <Typography variant="h5">Manage Group Teachers</Typography>
            </CardHeader>
            <CardBody>
                <List>
                    {teachers.map((teacher) => (
                        <ListItem key={teacher.id} className="flex justify-between items-center">
                            <Typography variant="body1">{teacher.name}</Typography>
                            <Checkbox
                                checked={selectedTeachers.includes(teacher.id)}
                                onChange={() => handleTeacherSelect(teacher.id)}
                            />
                        </ListItem>
                    ))}
                </List>
                <Button onClick={handleAddTeachersToGroup} className="mt-4" color="blue">
                    Add Selected Teachers to Group
                </Button>
            </CardBody>
            <ToastContainer />
        </Card>
    );
}

export default GroupTeacherManagement;
