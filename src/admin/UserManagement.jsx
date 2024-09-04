import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, limit, startAfter } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Button, Input, Typography } from '@material-tailwind/react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastVisible, setLastVisible] = useState(null); // За последния видим документ
    const [loading, setLoading] = useState(false); // Състояние за зареждане на данни
    const [hasMore, setHasMore] = useState(true); // Следи дали има още данни за зареждане

    useEffect(() => {
        fetchUsers(); // Зареждаме първоначалния набор от потребители
    }, []);

    const fetchUsers = async (isPagination = false) => {
        setLoading(true);
        try {
            const usersCollection = collection(db, 'users');
            let usersQuery = query(usersCollection, limit(10)); // Ограничаваме до 10 потребители

            if (isPagination && lastVisible) {
                usersQuery = query(usersCollection, startAfter(lastVisible), limit(10));
            }

            const usersSnapshot = await getDocs(usersQuery);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setUsers(prevUsers => isPagination ? [...prevUsers, ...usersList] : usersList);
            setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]); // Задаваме последния видим документ

            // Ако върнатите документи са по-малко от 10, няма повече потребители
            if (usersSnapshot.docs.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
            {loading && <Typography>Loading...</Typography>}
            {!loading && hasMore && (
                <Button onClick={() => fetchUsers(true)} className="mt-4">
                    Load More
                </Button>
            )}
            {!hasMore && <Typography>No more users to load.</Typography>}
        </div>
    );
};

export default UserManagement;
