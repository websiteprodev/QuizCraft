
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Button, Input, Typography } from '@material-tailwind/react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, 'users');
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        };

        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user => 
        user.email.includes(searchTerm) || 
        user.firstName.includes(searchTerm) || 
        user.lastName.includes(searchTerm)
    );

    const toggleBlockUser = async (userId, isBlocked) => {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            blocked: !isBlocked,
        });
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, blocked: !isBlocked } : user
            )
        );
    };

    return (
        <div className="p-6">
            <Typography variant="h4" className="mb-4">User Management</Typography>
            <Input
                type="text"
                placeholder="Search by email, first name, or last name"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4"
            />
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.blocked ? 'Blocked' : 'Active'}</td>
                            <td>
                                <Button
                                    color={user.blocked ? 'green' : 'red'}
                                    onClick={() => toggleBlockUser(user.id, user.blocked)}
                                >
                                    {user.blocked ? 'Unblock' : 'Block'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
