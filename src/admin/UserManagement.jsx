import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, limit, startAfter } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Button, Input, Typography } from '@material-tailwind/react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastVisible, setLastVisible] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [hasMore, setHasMore] = useState(true); 

    useEffect(() => {
        fetchUsers(); 
    }, []);

    const fetchUsers = async (isPagination = false) => {
        setLoading(true);
        try {
            const usersCollection = collection(db, 'users');
            let usersQuery = query(usersCollection, limit(10)); 

            if (isPagination && lastVisible) {
                usersQuery = query(usersCollection, startAfter(lastVisible), limit(10));
            }

            const usersSnapshot = await getDocs(usersQuery);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setUsers(prevUsers => isPagination ? [...prevUsers, ...usersList] : usersList);
            setLastVisible(usersSnapshot.docs[usersSnapshot.docs.length - 1]); 

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
        <div className="p-6 dark:bg-gray-800">
            <Typography variant="h4" className="mb-4 text-gray-800 dark:text-white">User Management</Typography>
            <Input
                type="text"
                placeholder="Search by email, first name, or last name"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4"
            />
            {filteredUsers.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">First Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.firstName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.blocked ? 'Blocked' : 'Active'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
            ) : (
                <Typography className="text-gray-500 dark:text-gray-400">No users found.</Typography>
            )}
            {loading && <Typography className="text-gray-500 dark:text-gray-400">Loading...</Typography>}
            {!loading && hasMore && (
                <Button onClick={() => fetchUsers(true)} className="mt-4">
                    Load More
                </Button>
            )}
            {!hasMore && <Typography className="text-gray-500 dark:text-gray-400">No more users to load.</Typography>}
        </div>
    );
};

export default UserManagement;
